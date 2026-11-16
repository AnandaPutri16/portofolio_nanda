# Ananda Putri Isnaeni Portfolio

This is a static personal portfolio website built with HTML, CSS, JavaScript, Tailwind CSS CDN, and Three.js CDN. It is designed for GitHub Pages and can be opened directly in a browser or published online.

## 1. Open the project in VS Code

1. Open VS Code.
2. Click File > Open Folder.
3. Choose this portfolio folder.
4. Open `index.html` in the editor.
5. You can preview it with the Live Server extension or by opening the file directly in the browser.

## 2. Replace profile images

The profile photos are stored inside:

- `assets/images/profile/profile.jpg`
- `assets/images/profile/about.jpg`

To replace them:

1. Open the folder.
2. Delete the placeholder image.
3. Add your own image with the same file name.
4. Keep the same extension `.jpg`.

Tip: use a portrait photo with a clean crop and soft background for best results.

## 3. Replace project screenshots

Project screenshots are inside:

- `assets/images/projects/`

Replace any of the following files with your own project images:

- `anak-terlantar-1.jpg`
- `anak-terlantar-2.jpg`
- `rtlh.jpg`
- `beautybloom.jpg`
- `portfolio.jpg`

## 4. Replace certificate images

Certificates are inside:

- `assets/images/certificates/`

Available files:

- `certificate-1.jpg`
- `certificate-2.jpg`
- `certificate-3.jpg`

Replace them with your own certificate images or update the labels in `index.html` if needed.

## 5. Replace organization images

Organization images are inside:

- `assets/images/organization/`

Editable files include:

- `dinas-sosial.jpg`
- `bem.jpg`
- `pob.jpg`
- `makrab.jpg`
- `mubes.jpg`
- `artwave.jpg`

## 6. Replace the CV

The placeholder CV file is here:

- `assets/cv/CV-ATS-Ananda-Putri-Isnaeni.pdf`

To replace it:

1. Delete the current file.
2. Add your own PDF with the same file name.
3. Keep the name exactly `CV-ATS-Ananda-Putri-Isnaeni.pdf` for the download links to work.

## 7. Change email

In `index.html`, find:

- `YOUR_EMAIL`

Replace it with your real email address. Example:

- `ananda@example.com`

## 8. Change WhatsApp

In `index.html`, replace:

- `YOUR_WHATSAPP_NUMBER`

Use only the phone number without spaces or symbols, for example:

- `6281234567890`

## 9. Change LinkedIn

In `index.html`, replace:

- `YOUR_LINKEDIN_URL`

Example:

- `https://www.linkedin.com/in/your-profile`

## 10. Change GitHub

In `index.html`, replace:

- `YOUR_GITHUB_URL`

Example:

- `https://github.com/yourusername`

## 11. Change project links

If a project is not yet hosted publicly, the buttons can stay as in-page links to the project gallery so the portfolio remains clean and functional.

When you do have a GitHub or live demo link, replace the placeholder values in `index.html` with your real URL.

## 12. Publish to GitHub Pages

Follow these steps:

1. Create a GitHub repository.
2. Upload all portfolio files to the repository.
3. Open the repository in GitHub.
4. Go to Settings.
5. Open Pages.
6. Select Deploy from branch.
7. Choose the `main` branch.
8. Set the folder to `/root`.
9. Save.
10. Wait a few moments.
11. Open the generated GitHub Pages URL.

The main entry point is `index.html`.

## Notes

- This project is fully static and does not require a backend.
- All links and file paths use relative paths so they work on GitHub Pages.
- The website will also work if you open `index.html` directly in the browser.

## File Structure

```text
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── certificates/
│   │   ├── organization/
│   │   └── decorations/
│   └── cv/
│       └── CV-ATS-Ananda-Putri-Isnaeni.pdf
└── README.md
```
