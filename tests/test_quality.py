import copy
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


gate = module('gate', ROOT / 'skills/kinesis-design-studio/scripts/quality-gate.py')
installer = module('installer', ROOT / 'scripts/install.py')
validator = module('validator', ROOT / 'scripts/validate_package.py')
search = module('search', ROOT / 'skills/kinesis-design-studio/scripts/search-library.py')


def ledger():
    return {'schema_version': 1, 'scope': 'Synthetic UI', 'revision': 'fixture-v1',
            'checks': [{'id': category, 'category': category, 'status': 'passed',
                        'context': 'Synthetic phone and desktop', 'evidence': ['fixture-log']}
                       for category in sorted(gate.CATEGORIES)],
            'defects': [], 'passes': [{'id': str(i), 'method': method, 'evidence': ['fixture-evidence']}
                                     for i, method in enumerate(('Initial probe', 'Post-repair visual review'))]}


class QualityTests(unittest.TestCase):
    def test_declared_complete_gate(self):
        self.assertEqual(gate.evaluate(ledger()), ([], []))

    def test_each_missing_category_blocks(self):
        for category in gate.CATEGORIES:
            data = ledger()
            data['checks'] = [check for check in data['checks'] if check['category'] != category]
            self.assertTrue(gate.evaluate(data)[1], category)

    def test_failed_or_blocked_check_blocks(self):
        for status in ('failed', 'blocked'):
            data = ledger()
            data['checks'][0]['status'] = status
            self.assertTrue(gate.evaluate(data)[1])

    def test_claimed_pass_requires_evidence(self):
        data = ledger()
        data['checks'][0]['evidence'] = []
        self.assertTrue(gate.evaluate(data)[0])

    def test_unverified_fix_does_not_close(self):
        data = ledger()
        data['defects'] = [{'id': 'D1', 'severity': 'major', 'status': 'fixed-unverified',
                            'description': 'Button occlusion', 'evidence': ['before.png']}]
        self.assertTrue(gate.evaluate(data)[1])
        data['defects'][0]['status'] = 'verified'
        self.assertTrue(gate.evaluate(data)[0])
        data['defects'][0]['validation'] = ['after.png', 'hit-test.json']
        self.assertEqual(gate.evaluate(data), ([], []))

    def test_major_residual_fails(self):
        data = ledger()
        data['defects'] = [{'id': 'D1', 'severity': 'major', 'status': 'residual',
                            'description': 'Jank', 'evidence': ['trace'], 'reason': 'No hardware', 'owner': 'Owner'}]
        self.assertTrue(gate.evaluate(data)[1])

    def test_layout_cannot_be_excluded(self):
        data = ledger()
        for check in data['checks']:
            if check['category'] == 'layout': check.update(status='not-applicable', reason='Skipped')
        self.assertTrue(gate.evaluate(data)[1])

    def test_duplicate_ids_and_boolean_version_invalid(self):
        data = ledger()
        data['schema_version'] = True
        data['checks'].append(copy.deepcopy(data['checks'][0]))
        self.assertGreaterEqual(len(gate.evaluate(data)[0]), 2)

    def test_malformed_inputs(self):
        for data in (None, [], {}, {'checks': 'bad'}): self.assertTrue(gate.evaluate(data)[0])


class PackageTests(unittest.TestCase):
    def test_source_integrity_and_single_entrypoint(self):
        self.assertEqual(validator.validate(), [])

    def test_style_database_is_searchable(self):
        results = search.search('minimalism', 5, 'styles')
        self.assertTrue(results)
        self.assertTrue(any('minimal' in str(item.get('row', {})).lower() for item in results))

    def test_installer_preserves_existing_installations(self):
        with tempfile.TemporaryDirectory() as directory:
            base = Path(directory)
            installed = installer.install('both', base)
            self.assertEqual(len(installed), 2)
            self.assertTrue(all((path / 'sources.lock.json').exists() for path in installed))
            with self.assertRaises(FileExistsError): installer.install('both', base)


if __name__ == '__main__':
    unittest.main()
