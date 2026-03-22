/**
 * Validated clinical screening questionnaire definitions.
 * Organized by category. Each includes questions, Likert options, and scoring.
 */

const QUESTIONNAIRES = {
  // ═══════════════════════════════════════════════════════════
  // DEPRESSION & MOOD DISORDERS
  // ═══════════════════════════════════════════════════════════

  'PHQ-9': {
    title: 'Patient Health Questionnaire (PHQ-9)',
    category: 'Depression & Mood',
    description: 'Screens for and measures the severity of depression.',
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading or watching television',
      'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless',
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
    scoring: (t) => t <= 4 ? 'Minimal' : t <= 9 ? 'Mild' : t <= 14 ? 'Moderate' : t <= 19 ? 'Moderately Severe' : 'Severe',
  },

  'BDI': {
    title: 'Beck Depression Inventory (BDI)',
    category: 'Depression & Mood',
    description: 'A 21-item test measuring depression severity.',
    questions: [
      'Sadness — how sad do you feel?',
      'Pessimism — how discouraged do you feel about the future?',
      'Past failure — how much do you feel like a failure?',
      'Loss of pleasure — how much pleasure do you get from things you used to enjoy?',
      'Guilty feelings — how guilty do you feel?',
      'Punishment feelings — do you feel you are being punished?',
      'Self-dislike — how do you feel about yourself?',
      'Self-criticalness — how critical are you of yourself?',
      'Suicidal thoughts or wishes — do you have thoughts of harming yourself?',
      'Crying — how much do you cry?',
      'Agitation — how restless or agitated are you?',
      'Loss of interest — how much have you lost interest in other people or activities?',
      'Indecisiveness — how difficult is it to make decisions?',
      'Worthlessness — do you feel worthless?',
      'Loss of energy — how much energy do you have?',
      'Changes in sleeping pattern — how have your sleep patterns changed?',
      'Irritability — how irritable are you?',
      'Changes in appetite — how has your appetite changed?',
      'Concentration difficulty — how hard is it to concentrate?',
      'Tiredness or fatigue — how tired or fatigued do you feel?',
      'Loss of interest in sex — how has your interest in sex changed?',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Mildly — it does not bother me much', value: 1 },
      { label: 'Moderately — it is unpleasant but I can stand it', value: 2 },
      { label: 'Severely — I can barely stand it', value: 3 },
    ],
    scoring: (t) => t <= 13 ? 'Minimal' : t <= 19 ? 'Mild' : t <= 28 ? 'Moderate' : 'Severe',
  },

  'MDQ': {
    title: 'Mood Disorder Questionnaire (MDQ)',
    category: 'Depression & Mood',
    description: 'Screens for bipolar disorder.',
    questions: [
      'Have you ever felt so good or hyper that others thought you were not your normal self, or so hyper that you got into trouble?',
      'Have you ever been so irritable that you shouted at people or started fights or arguments?',
      'Have you ever felt much more self-confident than usual?',
      'Have you ever gotten much less sleep than usual and found you did not really miss it?',
      'Have you ever been much more talkative or spoke much faster than usual?',
      'Have you ever had thoughts racing through your head?',
      'Have you ever been so easily distracted that you had trouble concentrating?',
      'Have you ever had much more energy than usual?',
      'Have you ever been much more active or done many more things than usual?',
      'Have you ever been much more social or outgoing, such as calling friends in the middle of the night?',
      'Have you ever been much more interested in sex than usual?',
      'Have you ever done things that were unusual for you or others might consider excessive, foolish, or risky?',
      'Have you ever spent money that got you or your family in trouble?',
    ],
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 },
    ],
    scoring: (t) => t < 7 ? 'Screen negative' : 'Screen positive — further evaluation recommended',
  },

  'KADS': {
    title: 'Kutcher Adolescent Depression Scale (KADS)',
    category: 'Depression & Mood',
    description: 'Tailored for teens to screen for depression.',
    questions: [
      'Low mood, feeling sad, down, miserable, "blah"',
      'Irritable, cranky, easily annoyed, angry',
      'Sleep difficulties — trouble falling asleep, staying asleep, or sleeping too much',
      'Feeling decreased interest in things you used to enjoy (like hanging out with friends, hobbies, sports)',
      'Feelings of worthlessness, hopelessness, letting people down',
      'Feeling tired, low energy, slowed down, hard to get motivated',
    ],
    options: [
      { label: 'Hardly ever', value: 0 },
      { label: 'Much of the time', value: 1 },
      { label: 'Most of the time', value: 2 },
      { label: 'All of the time', value: 3 },
    ],
    scoring: (t) => t <= 5 ? 'Minimal — possibly not depressed' : 'Possibly depressed — further evaluation recommended',
  },

  // ═══════════════════════════════════════════════════════════
  // ANXIETY & STRESS
  // ═══════════════════════════════════════════════════════════

  'GAD-7': {
    title: 'Generalized Anxiety Disorder (GAD-7)',
    category: 'Anxiety & Stress',
    description: 'Measures the severity of generalized anxiety.',
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Several days', value: 1 },
      { label: 'More than half the days', value: 2 },
      { label: 'Nearly every day', value: 3 },
    ],
    scoring: (t) => t <= 4 ? 'Minimal' : t <= 9 ? 'Mild' : t <= 14 ? 'Moderate' : 'Severe',
  },

  'BAI': {
    title: 'Beck Anxiety Inventory (BAI)',
    category: 'Anxiety & Stress',
    description: 'Evaluates the severity of anxiety symptoms.',
    questions: [
      'Numbness or tingling',
      'Feeling hot',
      'Wobbliness in legs',
      'Unable to relax',
      'Fear of worst happening',
      'Dizzy or lightheaded',
      'Heart pounding / racing',
      'Unsteady',
      'Terrified or afraid',
      'Nervous',
      'Feeling of choking',
      'Hands trembling',
      'Shaky / unsteady',
      'Fear of losing control',
      'Difficulty in breathing',
      'Fear of dying',
      'Scared',
      'Indigestion',
      'Faint / lightheaded',
      'Face flushed',
      'Hot / cold sweats',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'Mildly — did not bother me much', value: 1 },
      { label: 'Moderately — very unpleasant but I could stand it', value: 2 },
      { label: 'Severely — I could barely stand it', value: 3 },
    ],
    scoring: (t) => t <= 7 ? 'Minimal' : t <= 15 ? 'Mild' : t <= 25 ? 'Moderate' : 'Severe',
  },

  'PAS': {
    title: 'Panic and Agoraphobia Scale (PAS)',
    category: 'Anxiety & Stress',
    description: 'Assesses panic disorder symptoms.',
    questions: [
      'How often did you have panic attacks in the past week?',
      'How severe were the panic attacks?',
      'How long did the panic attacks last on average?',
      'How much did you worry about having another panic attack?',
      'How much did you avoid situations because of panic?',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'A little', value: 1 },
      { label: 'Moderately', value: 2 },
      { label: 'Quite a bit', value: 3 },
      { label: 'Extremely', value: 4 },
    ],
    scoring: (t) => t <= 4 ? 'Minimal' : t <= 8 ? 'Mild' : t <= 14 ? 'Moderate' : 'Severe',
  },

  'PSS': {
    title: 'Perceived Stress Scale (PSS)',
    category: 'Anxiety & Stress',
    description: 'Measures the perception of stress over the past month.',
    questions: [
      'In the last month, how often have you been upset because of something that happened unexpectedly?',
      'In the last month, how often have you felt that you were unable to control the important things in your life?',
      'In the last month, how often have you felt nervous and stressed?',
      'In the last month, how often have you felt confident about your ability to handle your personal problems?',
      'In the last month, how often have you felt that things were going your way?',
      'In the last month, how often have you found that you could not cope with all the things that you had to do?',
      'In the last month, how often have you been able to control irritations in your life?',
      'In the last month, how often have you felt that you were on top of things?',
      'In the last month, how often have you been angered because of things that happened that were outside of your control?',
      'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Almost Never', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Fairly Often', value: 3 },
      { label: 'Very Often', value: 4 },
    ],
    scoring: (t) => t <= 13 ? 'Low stress' : t <= 26 ? 'Moderate stress' : 'High perceived stress',
  },

  // ═══════════════════════════════════════════════════════════
  // PTSD & TRAUMA
  // ═══════════════════════════════════════════════════════════

  'PCL-5': {
    title: 'PTSD Checklist for DSM-5 (PCL-5)',
    category: 'PTSD & Trauma',
    description: 'Screens and monitors PTSD symptoms.',
    questions: [
      'Repeated, disturbing, and unwanted memories of a stressful experience',
      'Repeated, disturbing dreams of a stressful experience',
      'Suddenly feeling or acting as if a stressful experience were actually happening again',
      'Feeling very upset when something reminded you of a stressful experience',
      'Having strong physical reactions when something reminded you of a stressful experience',
      'Avoiding memories, thoughts, or feelings related to a stressful experience',
      'Avoiding external reminders of a stressful experience',
      'Trouble remembering important parts of a stressful experience',
      'Having strong negative beliefs about yourself, other people, or the world',
      'Blaming yourself or someone else for a stressful experience or what happened after it',
      'Having strong negative feelings such as fear, horror, anger, guilt, or shame',
      'Loss of interest in activities that you used to enjoy',
      'Feeling distant or cut off from other people',
      'Trouble experiencing positive feelings',
      'Irritable behavior, angry outbursts, or acting aggressively',
      'Taking too many risks or doing things that could cause you harm',
      "Being 'superalert' or watchful or on guard",
      'Feeling jumpy or easily startled',
      'Having difficulty concentrating',
      'Trouble falling or staying asleep',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'A little bit', value: 1 },
      { label: 'Moderately', value: 2 },
      { label: 'Quite a bit', value: 3 },
      { label: 'Extremely', value: 4 },
    ],
    scoring: (t) => t < 31 ? 'Below threshold' : t < 45 ? 'Probable PTSD' : 'Severe PTSD symptoms',
  },

  'ACE': {
    title: 'Adverse Childhood Experiences (ACE) Questionnaire',
    category: 'PTSD & Trauma',
    description: 'Assesses childhood trauma history.',
    questions: [
      'Did a parent or other adult in the household often swear at you, insult you, put you down, or humiliate you?',
      'Did a parent or other adult in the household often push, grab, slap, or throw something at you?',
      'Did an adult or person at least 5 years older ever touch or fondle you in a sexual way?',
      'Did you often feel that no one in your family loved you or thought you were important or special?',
      'Did you often feel that you did not have enough to eat, had to wear dirty clothes, or had no one to protect you?',
      'Were your parents ever separated or divorced?',
      'Was your mother or stepmother often pushed, grabbed, slapped, or had something thrown at her?',
      'Did you live with anyone who was a problem drinker or alcoholic, or who used street drugs?',
      'Was a household member depressed or mentally ill, or did a household member attempt suicide?',
      'Did a household member go to prison?',
    ],
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 },
    ],
    scoring: (t) => t === 0 ? 'No ACEs reported' : t <= 3 ? 'Some adverse experiences' : 'High ACE score — consider professional support',
  },

  // ═══════════════════════════════════════════════════════════
  // ADHD & DEVELOPMENTAL
  // ═══════════════════════════════════════════════════════════

  'ASRS-v1.1': {
    title: 'Adult ADHD Self-Report Scale (ASRS-v1.1)',
    category: 'ADHD & Developmental',
    description: 'Screens for ADHD in adults.',
    questions: [
      'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
      'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
      'How often do you have problems remembering appointments or obligations?',
      'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
      'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
      'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
      { label: 'Very Often', value: 4 },
    ],
    scoring: (t) => t < 14 ? 'Unlikely ADHD' : 'ADHD symptoms likely — further evaluation recommended',
  },

  'Vanderbilt': {
    title: 'Vanderbilt Assessment Scale',
    category: 'ADHD & Developmental',
    description: 'Screens children for ADHD and associated disorders.',
    questions: [
      'Fails to give close attention to details or makes careless mistakes in schoolwork',
      'Has difficulty sustaining attention in tasks or play activities',
      'Does not seem to listen when spoken to directly',
      'Does not follow through on instructions and fails to finish schoolwork or chores',
      'Has difficulty organizing tasks and activities',
      'Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort',
      'Loses things necessary for tasks and activities',
      'Is easily distracted by extraneous stimuli',
      'Is forgetful in daily activities',
      'Fidgets with hands or feet or squirms in seat',
      'Leaves seat in classroom or in other situations where remaining seated is expected',
      'Runs about or climbs excessively in situations where it is inappropriate',
      'Has difficulty playing or engaging in leisure activities quietly',
      'Is "on the go" or acts as if "driven by a motor"',
      'Talks excessively',
      'Blurts out answers before questions have been completed',
      'Has difficulty awaiting turn',
      'Interrupts or intrudes on others',
    ],
    options: [
      { label: 'Never', value: 0 },
      { label: 'Occasionally', value: 1 },
      { label: 'Often', value: 2 },
      { label: 'Very Often', value: 3 },
    ],
    scoring: (t) => t < 18 ? 'Below threshold' : t < 27 ? 'Possible ADHD — further evaluation recommended' : 'Likely ADHD — professional evaluation recommended',
  },

  // ═══════════════════════════════════════════════════════════
  // SPECIALIZED / OTHER
  // ═══════════════════════════════════════════════════════════

  'C-SSRS': {
    title: 'Columbia-Suicide Severity Rating Scale (C-SSRS)',
    category: 'Specialized',
    description: 'Assesses suicide risk. Your safety is our priority.',
    questions: [
      'Have you wished you were dead or wished you could go to sleep and not wake up?',
      'Have you actually had any thoughts of killing yourself?',
      'Have you been thinking about how you might do this?',
      'Have you had these thoughts and had some intention of acting on them?',
      'Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?',
    ],
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 },
    ],
    scoring: (t) => t === 0 ? 'No current ideation identified' : t <= 2 ? 'Ideation present — connect with support' : 'Active ideation — immediate support recommended',
    isCritical: true,
  },

  'ISI': {
    title: 'Insomnia Severity Index (ISI)',
    category: 'Specialized',
    description: 'Evaluates insomnia severity.',
    questions: [
      'Difficulty falling asleep',
      'Difficulty staying asleep',
      'Problems waking up too early',
      'How satisfied/dissatisfied are you with your current sleep pattern?',
      'How noticeable to others do you think your sleep problem is in terms of impairing the quality of your life?',
      'How worried/distressed are you about your current sleep problem?',
      'To what extent do you consider your sleep problem to interfere with your daily functioning?',
    ],
    options: [
      { label: 'None', value: 0 },
      { label: 'Mild', value: 1 },
      { label: 'Moderate', value: 2 },
      { label: 'Severe', value: 3 },
      { label: 'Very Severe', value: 4 },
    ],
    scoring: (t) => t <= 7 ? 'No clinically significant insomnia' : t <= 14 ? 'Subthreshold insomnia' : t <= 21 ? 'Moderate clinical insomnia' : 'Severe clinical insomnia',
  },

  'AQ': {
    title: 'Autism Spectrum Quotient (AQ)',
    category: 'Specialized',
    description: 'A screening tool for autism spectrum traits.',
    questions: [
      'I prefer to do things with others rather than on my own',
      'I prefer to do things the same way over and over again',
      'If I try to imagine something, I find it very easy to create a picture in my mind',
      'I frequently get so strongly absorbed in one thing that I lose sight of other things',
      'I often notice small sounds when others do not',
      'I usually notice car number plates or similar strings of information',
      'Other people frequently tell me that what I have said is impolite, even though I think it is polite',
      'When I am reading a story, I can easily imagine what the characters might look like',
      'I am fascinated by dates',
      'In a social group, I can easily keep track of several different conversations',
    ],
    options: [
      { label: 'Definitely Agree', value: 1 },
      { label: 'Slightly Agree', value: 1 },
      { label: 'Slightly Disagree', value: 0 },
      { label: 'Definitely Disagree', value: 0 },
    ],
    scoring: (t) => t <= 3 ? 'Low autistic traits' : t <= 6 ? 'Some autistic traits' : 'Elevated autistic traits — consider professional evaluation',
  },

  'OCI': {
    title: 'Obsessive Compulsive Inventory (OCI)',
    category: 'Specialized',
    description: 'Assesses OCD symptoms.',
    questions: [
      'I have saved up so many things that they get in the way',
      'I check things more often than necessary',
      'I get upset if objects are not arranged properly',
      'I feel compelled to count while I am doing things',
      'I find it difficult to touch an object when I know it has been touched by strangers or certain people',
      'I find it difficult to control my own thoughts',
      'I collect things I do not need',
      'I repeatedly check doors, windows, drawers, etc.',
      'I get upset if others change the way I have arranged things',
      'I feel I have to repeat certain numbers',
      'I sometimes have to wash or clean myself simply because I feel contaminated',
      'I am upset by unpleasant thoughts that come into my mind against my will',
      'I avoid throwing things away because I am afraid I might need them later',
      'I repeatedly check gas and water taps and light switches after turning them off',
      'I need things to be arranged in a particular way',
      'I feel that there are good and bad numbers',
      'I wash my hands more often and longer than necessary',
      'I frequently get nasty thoughts and have difficulty in getting rid of them',
    ],
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'A little', value: 1 },
      { label: 'Moderately', value: 2 },
      { label: 'A lot', value: 3 },
      { label: 'Extremely', value: 4 },
    ],
    scoring: (t) => t <= 20 ? 'Low OCD symptoms' : t <= 40 ? 'Moderate OCD symptoms' : 'High OCD symptoms — consider professional evaluation',
  },
};

export default QUESTIONNAIRES;
