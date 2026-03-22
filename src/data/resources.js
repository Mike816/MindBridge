/**
 * Comprehensive mental health resource directory.
 */

const RESOURCES = {
  crisis: [
    { name: '988 Suicide & Crisis Lifeline', contact: 'Call or text 988', available: '24/7/365', url: 'https://988lifeline.org', note: 'Chat at 988lifeline.org. TTY: dial 711 then 988.' },
    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', available: '24/7', url: 'https://www.crisistextline.org' },
    { name: 'Veterans Crisis Line', contact: 'Call 988, press 1 · Text 838255', available: '24/7', url: 'https://www.veteranscrisisline.net', note: 'For veterans and active-duty military.' },
    { name: 'Maternal Mental Health', contact: 'Call or text 1-833-TLC-MAMA (833-852-6262)', available: '24/7', url: 'https://www.postpartum.net', note: 'For pregnant or postpartum individuals.' },
    { name: 'SAMHSA Disaster Distress Helpline', contact: 'Call or text 1-800-985-5990', available: '24/7/365', url: 'https://www.samhsa.gov/find-help/disaster-distress-helpline', note: 'For emotional distress related to disasters.' },
  ],
  violence: [
    { name: 'National Domestic Violence Hotline', contact: '800-799-SAFE (7233) · Text START to 88788', available: '24/7', url: 'https://www.thehotline.org', note: 'TTY 800-787-3224. Available in Spanish.' },
    { name: 'National Sexual Assault Hotline', contact: '800-656-HOPE (4673)', available: '24/7', url: 'https://www.rainn.org' },
    { name: 'National Human Trafficking Hotline', contact: '1-888-373-7888', available: '24/7', url: 'https://humantraffickinghotline.org', note: '200+ languages available.' },
    { name: 'National Child Abuse Hotline', contact: '1-800-422-4453', available: '24/7', url: 'https://www.childhelp.org', note: 'Text also available at the same number.' },
    { name: 'National Center for Missing & Exploited Children', contact: '1-800-THE-LOST (1-800-843-5678)', available: '24/7', url: 'https://www.missingkids.org' },
  ],
  treatment: [
    { name: 'FindSupport.gov', contact: 'Online resource', available: 'Always', url: 'https://www.findsupport.gov', note: 'Health care, treatment options, payment options, and coping resources.' },
    { name: 'SAMHSA Treatment Locator', contact: 'findtreatment.gov', available: 'Always', url: 'https://findtreatment.gov' },
    { name: 'SAMHSA National Helpline', contact: '1-800-662-HELP (4357) · Text ZIP to 435748', available: '24/7/365', url: 'https://www.samhsa.gov/find-help/national-helpline', note: 'Free, confidential. TTY 1-800-487-4889.' },
  ],
  providers: [
    { name: 'Find a Psychiatrist (APA)', contact: 'Online directory', available: 'Always', url: 'https://finder.psychiatry.org' },
    { name: 'Find a Psychologist (APA)', contact: 'Online directory', available: 'Always', url: 'https://locator.apa.org' },
    { name: 'Child & Adolescent Psychiatrist Finder (AACAP)', contact: 'Online directory', available: 'Always', url: 'https://www.aacap.org/AACAP/Families_and_Youth/Resources/CAP_Finder.aspx' },
    { name: 'Find a CBT Therapist (ABCT)', contact: 'Online directory', available: 'Always', url: 'https://www.abct.org/get-help/' },
    { name: 'Find a Therapist (Psychology Today)', contact: 'Online directory', available: 'Always', url: 'https://www.psychologytoday.com/us/therapists' },
    { name: 'Mental Health America Directories', contact: 'Online directory', available: 'Always', url: 'https://www.mhanational.org/finding-help' },
    { name: 'HealthyChildren.org (AAP Pediatrician Finder)', contact: 'Online directory', available: 'Always', url: 'https://www.healthychildren.org' },
  ],
  support: [
    { name: 'NAMI HelpLine', contact: '1-800-950-NAMI (6264)', available: 'Mon–Fri, 10am–10pm ET', url: 'https://www.nami.org/help', note: 'Free peer support, info, and referrals.' },
    { name: 'NAMI Support Groups', contact: 'Online & in-person', available: 'Various', url: 'https://www.nami.org/Support-Education/Support-Groups' },
    { name: 'SAMHSA Support Groups', contact: 'Online directory', available: 'Various', url: 'https://www.samhsa.gov/find-support/health-care-or-support' },
    { name: 'DBSA Support Groups', contact: 'Online & in-person', available: 'Various', url: 'https://www.dbsalliance.org' },
  ],
  depression: [
    { name: 'NAMI HelpLine', contact: '1-800-950-NAMI (6264)', available: 'Mon–Fri, 10am–10pm ET', url: 'https://www.nami.org/help' },
    { name: 'DBSA (Depression & Bipolar Support Alliance)', contact: 'Online & in-person groups', available: 'Various', url: 'https://www.dbsalliance.org' },
  ],
  anxiety: [
    { name: 'ADAA Resources', contact: 'Online resources', available: 'Always', url: 'https://adaa.org' },
    { name: 'MindShift CBT App', contact: 'Free app', available: 'Always', url: 'https://www.anxietycanada.com/resources/mindshift-cbt/' },
  ],
  ptsd: [
    { name: 'PTSD Foundation of America', contact: '877-717-7873', available: '24/7', url: 'https://ptsdusa.org' },
    { name: 'PTSD Coach App (VA)', contact: 'Free app', available: 'Always', url: 'https://mobile.va.gov/app/ptsd-coach' },
    { name: 'VA Mental Health Resources', contact: 'Online', available: 'Always', url: 'https://www.mentalhealth.va.gov' },
    { name: 'Make the Connection (Veterans)', contact: 'Stories, videos, resources', available: 'Always', url: 'https://maketheconnection.net' },
  ],
  adhd: [
    { name: 'CHADD', contact: 'Online & support groups', available: 'Various', url: 'https://chadd.org' },
    { name: 'ADDitude Magazine', contact: 'Online resources', available: 'Always', url: 'https://www.additudemag.com' },
  ],
  substance: [
    { name: 'SAMHSA National Helpline', contact: '1-800-662-HELP (4357)', available: '24/7', url: 'https://www.samhsa.gov/find-help/national-helpline' },
    { name: 'AA Meeting Finder', contact: 'Online & in-person', available: 'Various', url: 'https://www.aa.org/find-aa' },
  ],
  sleep: [
    { name: 'Sleep Foundation', contact: 'Online resources', available: 'Always', url: 'https://www.sleepfoundation.org' },
    { name: 'CBT-i Coach App (VA)', contact: 'Free app', available: 'Always', url: 'https://mobile.va.gov/app/cbt-i-coach' },
  ],
  stress: [
    { name: 'Headspace', contact: 'App & online', available: 'Always', url: 'https://www.headspace.com' },
    { name: 'Calm', contact: 'App & online', available: 'Always', url: 'https://www.calm.com' },
  ],
  student: [
    { name: 'JED Foundation', contact: 'Text START to 741741', available: '24/7', url: 'https://jedfoundation.org' },
    { name: 'Active Minds', contact: 'Online resources', available: 'Always', url: 'https://www.activeminds.org' },
    { name: 'Campus Counseling Center', contact: 'Check your university website', available: 'Varies', url: '' },
  ],
  insurance: [
    { name: 'HealthCare.gov', contact: 'Medicaid, CHIP, & Marketplace plans', available: 'Always', url: 'https://www.healthcare.gov', note: 'Enroll in insurance coverage.' },
    { name: 'Community Health Centers', contact: 'Low-cost health care', available: 'Varies', url: 'https://findahealthcenter.hrsa.gov', note: 'For those without insurance.' },
  ],
  basicneeds: [
    { name: '211 Helpline', contact: 'Call 211 or visit 211.org', available: '24/7', url: 'https://www.211.org', note: 'Help finding food, housing, and essential services.' },
    { name: 'Resource Benefits Guide (HHS)', contact: 'Online guide', available: 'Always', url: 'https://www.acf.hhs.gov', note: 'Federal benefits for families with children 0-12.' },
    { name: 'Eldercare Locator', contact: '1-800-677-1116', available: 'Mon–Fri', url: 'https://eldercare.acl.gov', note: 'Services for older adults. TTY: dial 711 then the number.' },
  ],
};

export default RESOURCES;
