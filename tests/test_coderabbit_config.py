"""Regression tests for the PR review policy in .coderabbit.yaml.

Requires PyYAML. Run explicitly with:
    python3 -m unittest discover -s tests -p 'test_coderabbit_config.py'

These tests validate repository configuration, not the GitHub App's behavior.
"""

from pathlib import Path
import unittest

import yaml


ROOT = Path(__file__).resolve().parents[1]


class CodeRabbitConfigTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with (ROOT / ".coderabbit.yaml").open(encoding="utf-8") as source:
            cls.config = yaml.safe_load(source)

    def test_configuration_is_a_yaml_mapping(self):
        self.assertIsInstance(self.config, dict)

    def test_reviews_use_korean_and_the_chill_profile(self):
        self.assertEqual(self.config["language"], "ko-KR")
        self.assertEqual(self.config["reviews"]["profile"], "chill")

    def test_experimental_features_are_disabled(self):
        self.assertIs(self.config["early_access"], False)

    def test_automatic_reviews_are_enabled(self):
        self.assertIs(self.config["reviews"]["auto_review"]["enabled"], True)

    def test_drafts_are_excluded_from_automatic_review(self):
        self.assertIs(self.config["reviews"]["auto_review"]["drafts"], False)

    def test_automatic_review_targets_only_main(self):
        # Exact equality also rejects a second branch or a broad regex such as .*.
        self.assertEqual(
            self.config["reviews"]["auto_review"]["base_branches"], ["main"]
        )

    def test_reviews_do_not_request_changes(self):
        self.assertIs(self.config["reviews"]["request_changes_workflow"], False)

    def test_automatic_unit_test_generation_stays_disabled(self):
        # Regression: the PR's latest revision explicitly opts out of this feature.
        self.assertIs(
            self.config["reviews"]["finishing_touches"]["unit_tests"]["enabled"],
            False,
        )

    def test_review_reporting_options(self):
        expected = {
            "high_level_summary": True,
            "poem": False,
            "review_status": True,
            "collapse_walkthrough": False,
        }
        for setting, value in expected.items():
            with self.subTest(setting=setting):
                # Identity catches quoted YAML booleans that would be truthy strings.
                self.assertIs(self.config["reviews"][setting], value)

    def test_instruction_scopes_are_unique_and_include_documents(self):
        rules = self.config["reviews"]["path_instructions"]
        self.assertIsInstance(rules, list)
        self.assertCountEqual([rule["path"] for rule in rules], ["**/*", "docs/**"])
        for rule in rules:
            with self.subTest(path=rule["path"]):
                self.assertIsInstance(rule["instructions"], str)
                self.assertTrue(rule["instructions"].strip())

    def test_general_instructions_reference_existing_shared_review_criteria(self):
        rules = self.config["reviews"]["path_instructions"]
        general = next(rule for rule in rules if rule["path"] == "**/*")
        self.assertIn("CODEX_REVIEW.md", general["instructions"])
        self.assertIn("NEEDS_PRODUCT_DECISION", general["instructions"])
        criteria = ROOT / "CODEX_REVIEW.md"
        self.assertTrue(criteria.is_file())
        self.assertTrue(criteria.read_text(encoding="utf-8").strip())

    def test_chat_auto_reply_is_enabled(self):
        self.assertIs(self.config["chat"]["auto_reply"], True)


if __name__ == "__main__":
    unittest.main()
