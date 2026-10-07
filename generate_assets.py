from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent


def make_placeholder(path: Path, title: str, bg1=(247, 219, 226), bg2=(255, 250, 247), accent=(214, 146, 167), size=(1200, 900)):
    img = Image.new('RGB', size, (255, 255, 255))
    draw = ImageDraw.Draw(img)

    for y in range(size[1]):
        ratio = y / size[1]
        r = int(bg1[0] * (1 - ratio) + bg2[0] * ratio)
        g = int(bg1[1] * (1 - ratio) + bg2[1] * ratio)
        b = int(bg1[2] * (1 - ratio) + bg2[2] * ratio)
        draw.line((0, y, size[0], y), fill=(r, g, b))

    draw.ellipse((120, 150, 520, 560), fill=(255, 255, 255, 80))
    draw.ellipse((760, 230, 1160, 640), fill=(255, 255, 255, 70))
    draw.ellipse((500, 660, 980, 980), fill=(255, 255, 255, 60))
    draw.rounded_rectangle((240, 300, 960, 610), radius=32, fill=(255, 255, 255, 150))
    draw.rounded_rectangle((300, 370, 900, 500), radius=24, fill=(255, 255, 255, 60), outline=(255, 255, 255, 80), width=2)

    try:
        title_font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 58)
        sub_font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 28)
    except Exception:
        title_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()

    draw.text((340, 410), title, fill=accent, font=title_font)
    draw.text((420, 500), 'Replace with your image', fill=(77, 58, 57), font=sub_font)

    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, quality=90)


placeholder_files = {
    'assets/images/profile/profile.jpg': 'Profile',
    'assets/images/profile/about.jpg': 'About',
    'assets/images/projects/anak-terlantar-1.jpg': 'Anak Terlantar',
    'assets/images/projects/anak-terlantar-2.jpg': 'Dashboard',
    'assets/images/projects/rtlh.jpg': 'RTLH',
    'assets/images/projects/beautybloom.jpg': 'BeautyBloom',
    'assets/images/projects/portfolio.jpg': 'Portfolio',
    'assets/images/certificates/certificate-1.jpg': 'Certificate 1',
    'assets/images/certificates/certificate-2.jpg': 'Certificate 2',
    'assets/images/certificates/certificate-3.jpg': 'Certificate 3',
    'assets/images/organization/dinas-sosial.jpg': 'Dinas Sosial',
    'assets/images/organization/bem.jpg': 'BEM',
    'assets/images/organization/pob.jpg': 'POB',
    'assets/images/organization/makrab.jpg': 'Makrab',
    'assets/images/organization/mubes.jpg': 'Mubes',
    'assets/images/organization/artwave.jpg': 'Artwave',
}

for relative_path, title in placeholder_files.items():
    make_placeholder(root / relative_path, title)

pdf_path = root / 'assets/cv/CV-Ananda-Putri-Isnaeni.pdf'
pdf_path.parent.mkdir(parents=True, exist_ok=True)
pdf_path.write_bytes(
    b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 72 >>\nstream\nBT\n/F1 14 Tf\n50 80 Td\n(CV placeholder) Tj\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000063 00000 n \n0000000128 00000 n \n0000000247 00000 n \n0000000617 00000 n \n0000000736 00000 n \ntrailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n812\n%%EOF\n'
)

print('Generated placeholder assets.')
