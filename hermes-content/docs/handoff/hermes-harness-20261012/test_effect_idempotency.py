"""Focused tests for per-effect idempotency keys; no dispatcher/API calls."""
import unittest

from gate import dispatch_key, effect_idempotency_key


class EffectIdempotencyKey(unittest.TestCase):
    def setUp(self):
        self.state = dict(worker_id='worker-a', contract_id='contract-a',
                          input_sha='input-a', step='review')

    def test_stable_across_retries_and_separate_from_dispatch_key(self):
        first = effect_idempotency_key(self.state, 'write_result')
        retry = effect_idempotency_key(dict(self.state), 'write_result')
        self.assertEqual(first, retry)
        self.assertNotEqual(first, dispatch_key(self.state))

    def test_distinct_effect_names_have_distinct_keys(self):
        self.assertNotEqual(effect_idempotency_key(self.state, 'write_result'),
                            effect_idempotency_key(self.state, 'notify_owner'))

    def test_empty_effect_name_fails_closed(self):
        for name in ('', '  ', None):
            with self.subTest(name=name), self.assertRaises(ValueError):
                effect_idempotency_key(self.state, name)


if __name__ == '__main__':
    unittest.main(verbosity=2)
