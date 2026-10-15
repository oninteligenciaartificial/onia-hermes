import unittest
from verify_signature import verified_signer


class SignatureTests(unittest.TestCase):
    def test_official_first_imported_does_not_authorize_other_signer(self):
        # Fake GPG output: the import/list could show the pinned key first;
        # only the actual validated manifest signer is authoritative.
        self.assertFalse(verified_signer("[GNUPG:] IMPORT_OK 1 PINNED\n[GNUPG:] VALIDSIG OTHER rest\n", "PINNED"))

    def test_exact_single_validated_signer(self):
        self.assertTrue(verified_signer("[GNUPG:] NEWSIG\n[GNUPG:] VALIDSIG PINNED rest\n", "PINNED"))

    def test_missing_or_multiple_signatures_block(self):
        self.assertFalse(verified_signer("[GNUPG:] GOODSIG PINNED\n", "PINNED"))
        self.assertFalse(verified_signer("[GNUPG:] VALIDSIG PINNED x\n[GNUPG:] VALIDSIG OTHER x\n", "PINNED"))


if __name__ == "__main__":
    unittest.main()
