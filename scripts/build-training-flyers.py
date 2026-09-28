from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
ROOT=Path(__file__).resolve().parents[1]
NAVY=colors.HexColor('#14234b');GOLD=colors.HexColor('#f59e0b');GRAY=colors.HexColor('#526074')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleBrand',fontName='Helvetica-Bold',fontSize=25,leading=29,textColor=NAVY,spaceAfter=12))
styles.add(ParagraphStyle(name='Kicker',fontName='Helvetica-Bold',fontSize=10,leading=14,textColor=GRAY,spaceAfter=10))
styles.add(ParagraphStyle(name='BodyBrand',fontName='Helvetica',fontSize=10,leading=15,textColor=NAVY,spaceAfter=8))
styles.add(ParagraphStyle(name='SectionBrand',fontName='Helvetica-Bold',fontSize=14,leading=19,textColor=NAVY,spaceBefore=12,spaceAfter=8))
styles.add(ParagraphStyle(name='SmallBrand',fontName='Helvetica',fontSize=8,leading=11,textColor=GRAY))
def para(t,sty='BodyBrand'):return Paragraph(t,styles[sty])
regions=[('ghs','Ghana','GHS 4,500','GHS 10,000','GHS 6,500','3 monthly payments of GHS 1,700','3 monthly payments of GHS 2,400'),('vt','Vanuatu','VT 120,000','VT 250,000','VT 180,000','3 monthly payments of VT 45,000','3 monthly payments of VT 65,000'),('usd','International (USD)','$1,000','$2,100','$1,500','3 monthly payments of $375','3 monthly payments of $550')]
for code,region,p1,full,p2,i1,i2 in regions:
 path=ROOT/f'public/downloads/training-flyer-{code}.pdf'
 doc=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=42,leftMargin=42,topMargin=36,bottomMargin=36,title=f'Steve Toti Training - {region}',author='Stephen Totimeh')
 story=[para('STEVE TOTI  /  PERSONAL TRAINING','Kicker'),para('Digital Business<br/>&amp; AI Mastery','TitleBrand'),para('Learn one-on-one with Stephen Totimeh, AI Personality of the Year 2026. Hands-on training built around your real business.'),para('6 weeks per phase  |  3 months for both phases<br/>3 ninety-minute sessions per week  |  In person or online','Kicker')]
 story += [para('01  Digital Business Foundations','SectionBrand'),para('<b>1 month and 2 weeks (6 weeks) · 18 sessions</b><br/>Business setup, website development, digital marketing, affiliate marketing, advertising and AI-assisted video production.'),para('<b>Affiliate marketing:</b> choose suitable offers, create helpful recommendations, set up referral links and disclosures, and track performance.')]
 story += [para('02  AI Mastery &amp; Automation','SectionBrand'),para('<b>1 month and 2 weeks (6 weeks) · 18 sessions</b><br/>Business automation, AI tools and app creation, and delivering AI training to institutions. Take Phase 1 first, or bring existing business and technical experience.')]
 story += [para('03  Mentorship after your training','SectionBrand'),para('<b>3 months included with every option.</b> Personalised guidance based on your needs and progress. Apply your skills, work through challenges and improve your approach as you work towards your income goals. Your support plan is agreed around your needs.')]
 story += [para(f'Your investment · {region}','SectionBrand')]
 rows=[[para('<b>Training option</b>'),para('<b>Pay in full</b>'),para('<b>Monthly option</b>')],[para('Phase 1 · 6 weeks'),para(p1),para(i1)],[para('Both phases · 3 months / 36 sessions'),para(full),para('Discuss on your discovery call')],[para('Phase 2 · 6 weeks'),para(p2),para(i2)]]
 table=Table(rows,colWidths=[195,94,222]);table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#edf1f7')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),4),('LINEBELOW',(0,0),(-1,-1),.5,colors.HexColor('#dce2ec'))]));story.append(table)
 story += [Spacer(1,10),para('Includes tools and templates, WhatsApp support between sessions, a capstone project, a completion certificate and post-training mentorship. Monthly payments may continue during the mentorship period.','SmallBrand'),Spacer(1,12),para('<b>Book a free discovery call</b> · <link href="https://www.stevetoti.com/training" color="#1e3a8a">www.stevetoti.com/training</link><br/>me@stevetoti.com','BodyBrand'),para('No payment is taken when you submit an enrolment request. Results depend on effort, implementation and market conditions. Updated September 2026.','SmallBrand')]
 doc.build(story)
 print(path.name)
