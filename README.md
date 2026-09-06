# CobbleAOI Docs

This folder is ready to publish with GitHub Pages.

## Publish with GitHub Pages

1. Create a GitHub repository for this documentation.
2. Copy the contents of this folder into the repository root.
3. Push the files to GitHub.
4. Open **Settings > Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the branch containing these files and the `/ (root)` folder.
7. Save and wait for the Pages deployment to finish.

The site entry point is `index.md`. GitHub Pages will build it and the linked Markdown documents with Jekyll.

### Automatic deployment

The included `.github/workflows/pages.yml` deploys the site whenever `main` changes. To use it, push this folder's contents to the root of a GitHub repository, then choose **Settings > Pages > GitHub Actions** as the source. The repository's Actions permissions must allow Pages deployments.

## Included references

- `modregister.md`: organized KubeJS and addon reference
- `kubejs-addons.md`: earlier addon recipe and event guide
- `modregister-items.md`: live searchable item registry
- `modregister-blocks.md`: live searchable block registry
- `modregister-fluids.md`: live searchable fluid registry
- `modregister-gases.md`: gas-tagged resources and notes

The registry snapshots came from the running pack and should be refreshed after major mod-list changes.
