"""Sphinx configuration."""
from __future__ import annotations

import importlib.metadata
import warnings
from functools import partial
from typing import TYPE_CHECKING, Any

from sqlalchemy.exc import SAWarning

if TYPE_CHECKING:
    from sphinx.addnodes import document
    from sphinx.application import Sphinx

warnings.filterwarnings("ignore", category=SAWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)  # RemovedInSphinx80Warning

# -- Project information -----------------------------------------------------
project = importlib.metadata.metadata("app")["Name"]
copyright = "2024, Nectar Labs UG"
author = "Cody Fincher"
release = importlib.metadata.version("app")

# -- General configuration ---------------------------------------------------
extensions = [
    "sphinx_click",
    "sphinx_design",
    "sphinx.ext.todo",
    "sphinx_copybutton",
    "sphinx.ext.autodoc",
    "sphinx.ext.viewcode",
    "sphinx.ext.napoleon",
    "sphinxcontrib.mermaid",
    "sphinx.ext.intersphinx",
    "sphinx_toolbox.collapse",
    "sphinx.ext.autosectionlabel",
]

exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]

intersphinx_mapping = {
    "python": ("https://docs.python.org/3", None),
    "anyio": ("https://anyio.readthedocs.io/en/stable/", None),
    "click": ("https://click.palletsprojects.com/en/8.1.x/", None),
    "structlog": ("https://www.structlog.org/en/stable/", None),
    "litestar": ("https://docs.litestar.dev/latest/", None),
    "msgspec": ("https://jcristharif.com/msgspec/", None),
    "saq": ("https://saq-py.readthedocs.io/en/latest/", None),
    "advanced-alchemy": ("https://docs.advanced-alchemy.jolt.rs/latest/", None),
}

napoleon_google_docstring = True
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = True
napoleon_use_admonition_for_notes = True
napoleon_use_admonition_for_references = False
napoleon_attr_annotations = True

autoclass_content = "both"
autodoc_default_options = {
    "members": True,
    "member-order": "bysource",
    "special-members": "__init__",
    "exclude-members": "__weakref__",
    "show-inheritance": True,
    "class-signature": "separated",
    "typehints-format": "short",
}

autosectionlabel_prefix_document = True
suppress_warnings = [
    "autosectionlabel.*",
    "ref.python",  # TODO: remove when https://github.com/sphinx-doc/sphinx/issues/4961 is fixed
]
todo_include_todos = True

# -- Style configuration -----------------------------------------------------
html_theme = "litestar_sphinx_theme"
html_static_path = ["_static"]
html_show_sourcelink = True
html_title = "Chapter Docs"
html_context = {
    "github_user": "chapter-gtm",
    "github_repo": "chapter",
    "github_version": "main",
    "doc_path": "docs",
}
html_theme_options = {
    "use_page_nav": False,
    "use_edit_page_button": True,
    "github_repo_name": "chapter",
    "logo": {
        "link": "https://chapter.show",
    },
    "extra_navbar_items": {
        "Documentation": "index",
        "Community": {},
        "About": {
            "Chapter Organization": {
                "description": "About the Chapter organization",
                "link": "https://chapter.show/",
                "icon": "org",
            },
        },
    },
}


def update_html_context(
    app: Sphinx,
    pagename: str,
    templatename: str,
    context: dict[str, Any],
    doctree: document,
) -> None:
    context["generate_toctree_html"] = partial(context["generate_toctree_html"], startdepth=0)


def setup(app: Sphinx) -> dict[str, bool]:
    app.setup_extension("litestar_sphinx_theme")
    app.setup_extension("pydata_sphinx_theme")
    app.connect("html-page-context", update_html_context)

    return {"parallel_read_safe": True, "parallel_write_safe": True}
