export const simulationScenarios = {
  Engineering: [
    {
      id: 'eng-1',
      title: 'System Outage at 3AM',
      description: 'You are the on-call engineer. The production API is returning 500 errors. 50,000 users are affected.',
      domain: 'Engineering',
      difficulty: 'Hard',
      timeLimit: 300,
      steps: [
        {
          id: 's1',
          scene: '🚨 PagerDuty fires. Production is down. Your Slack is exploding. What do you do first?',
          choices: [
            { id: 'a', text: 'Check the monitoring dashboard (Grafana/Datadog)', score: { accuracy: 10, logic: 10, risk: 8, speed: 7 }, next: 's2a', feedback: 'Smart move — data before action.' },
            { id: 'b', text: 'Roll back the last deployment immediately', score: { accuracy: 6, logic: 5, risk: 4, speed: 9 }, next: 's2b', feedback: 'Too hasty — you need to confirm the root cause first.' },
            { id: 'c', text: 'Ping the team and escalate', score: { accuracy: 4, logic: 4, risk: 7, speed: 5 }, next: 's2b', feedback: 'Escalation matters, but you should check data first.' },
          ],
        },
        {
          id: 's2a',
          scene: 'Grafana shows a memory spike at 2:47AM. The spike correlates with a config push. You spot an error: "Database connection pool exhausted." What next?',
          choices: [
            { id: 'a', text: 'Increase the connection pool limit in config and redeploy', score: { accuracy: 9, logic: 9, risk: 8, speed: 8 }, next: 's3', feedback: 'Correct diagnosis and fix — great engineering instinct.' },
            { id: 'b', text: 'Restart all app servers', score: { accuracy: 5, logic: 5, risk: 5, speed: 8 }, next: 's3', feedback: 'Might work short-term but masks the real problem.' },
            { id: 'c', text: 'Notify stakeholders and wait for DB admin', score: { accuracy: 3, logic: 3, risk: 5, speed: 3 }, next: 's3', feedback: 'Communication is good but you have the skills to act here.' },
          ],
        },
        {
          id: 's2b',
          scene: 'After rollback, the errors reduce by 40% but persist. Logs show "OOM Kill" on 3 pods. What do you do?',
          choices: [
            { id: 'a', text: 'Scale up the pod memory limits and investigate the memory leak', score: { accuracy: 9, logic: 8, risk: 7, speed: 7 }, next: 's3', feedback: 'Good — addressing symptoms while investigating the root cause.' },
            { id: 'b', text: 'Scale the cluster horizontally', score: { accuracy: 6, logic: 6, risk: 6, speed: 8 }, next: 's3', feedback: 'Buys time but does not fix the underlying leak.' },
            { id: 'c', text: 'Declare an incident and wake up senior engineers', score: { accuracy: 4, logic: 4, risk: 6, speed: 5 }, next: 's3', feedback: 'Escalation is needed but you should have more context first.' },
          ],
        },
        {
          id: 's3',
          scene: 'System is stable now. You write an incident report. What do you include?',
          choices: [
            { id: 'a', text: 'Timeline, root cause, impact, fix applied, follow-up actions', score: { accuracy: 10, logic: 10, risk: 10, speed: 8 }, next: null, feedback: 'Perfect incident report structure — this is how top engineers operate.' },
            { id: 'b', text: 'What broke and how you fixed it', score: { accuracy: 5, logic: 5, risk: 5, speed: 9 }, next: null, feedback: 'Missing timeline, impact analysis, and prevention steps.' },
            { id: 'c', text: 'Skip the report — it\'s fixed', score: { accuracy: 0, logic: 0, risk: 0, speed: 10 }, next: null, feedback: 'Never skip post-mortems. This leads to recurring incidents.' },
          ],
        },
      ],
    },
  ],

  Medical: [
    {
      id: 'med-1',
      title: 'Emergency Room: Code Blue',
      description: 'You are a resident doctor. A 58-year-old patient presents with chest pain, diaphoresis, and shortness of breath.',
      domain: 'Medical',
      difficulty: 'Hard',
      timeLimit: 240,
      steps: [
        {
          id: 's1',
          scene: '🏥 Patient arrives. BP 90/60, HR 110, SpO2 92%. He is pale and anxious. Immediate action?',
          choices: [
            { id: 'a', text: 'Oxygen, IV access, 12-lead ECG, aspirin 325mg', score: { accuracy: 10, logic: 10, risk: 9, speed: 9 }, next: 's2a', feedback: 'Textbook STEMI response — excellent clinical instinct.' },
            { id: 'b', text: 'Order chest X-ray and wait for results', score: { accuracy: 4, logic: 4, risk: 3, speed: 3 }, next: 's2b', feedback: 'Too passive for a time-critical cardiac event.' },
            { id: 'c', text: 'Give morphine for pain and monitor', score: { accuracy: 3, logic: 3, risk: 4, speed: 5 }, next: 's2b', feedback: 'Pain management alone misses the cardiac emergency.' },
          ],
        },
        {
          id: 's2a',
          scene: 'ECG shows ST elevation in leads II, III, aVF — inferior STEMI. Cath lab is available. Next step?',
          choices: [
            { id: 'a', text: 'Activate cath lab, call cardiology, prepare for primary PCI', score: { accuracy: 10, logic: 10, risk: 9, speed: 9 }, next: 's3', feedback: 'Door-to-balloon time is critical. You are saving a life.' },
            { id: 'b', text: 'Give thrombolytics (tPA) first', score: { accuracy: 5, logic: 5, risk: 6, speed: 7 }, next: 's3', feedback: 'PCI is preferred when cath lab is available within 90 min.' },
            { id: 'c', text: 'Consult senior first', score: { accuracy: 6, logic: 6, risk: 7, speed: 5 }, next: 's3', feedback: 'Sensible, but precious minutes are lost.' },
          ],
        },
        {
          id: 's2b',
          scene: 'Patient deteriorates: BP drops to 70/50. He stops responding. Crash cart arrives. You call Code Blue.',
          choices: [
            { id: 'a', text: 'Start CPR, defibrillate if shockable, run ACLS protocol', score: { accuracy: 9, logic: 9, risk: 8, speed: 9 }, next: 's3', feedback: 'Correct ACLS response — you are managing a cardiac arrest.' },
            { id: 'b', text: 'Give epinephrine and wait', score: { accuracy: 5, logic: 4, risk: 4, speed: 5 }, next: 's3', feedback: 'Epinephrine is part of ACLS, but CPR must come first.' },
            { id: 'c', text: 'Call senior and step aside', score: { accuracy: 1, logic: 1, risk: 1, speed: 2 }, next: 's3', feedback: 'You must take charge — every second counts.' },
          ],
        },
        {
          id: 's3',
          scene: 'Patient stabilized. Family is distressed. You need to communicate the situation.',
          choices: [
            { id: 'a', text: 'Use SPIKES protocol: honest, compassionate, clear prognosis', score: { accuracy: 10, logic: 9, risk: 10, speed: 8 }, next: null, feedback: 'Excellent patient communication — empathy + clarity.' },
            { id: 'b', text: 'Tell them he is stable and avoid scary details', score: { accuracy: 3, logic: 3, risk: 5, speed: 8 }, next: null, feedback: 'Overly optimistic communication can damage trust.' },
            { id: 'c', text: 'Let the senior doctor handle the family', score: { accuracy: 2, logic: 2, risk: 3, speed: 5 }, next: null, feedback: 'Avoid delegating communication — you are the treating doctor.' },
          ],
        },
      ],
    },
  ],

  Business: [
    {
      id: 'biz-1',
      title: 'Product Launch Crisis',
      description: 'You are a Product Manager at a Series B startup. Your app launches tomorrow and QA found a critical auth bug.',
      domain: 'Business',
      difficulty: 'Medium',
      timeLimit: 300,
      steps: [
        {
          id: 's1',
          scene: '🚀 T-18 hours. QA reports users can bypass authentication in the mobile app. CEO is already on a call with investors. What do you do?',
          choices: [
            { id: 'a', text: 'Delay launch, fix the bug, communicate transparently to stakeholders', score: { accuracy: 10, logic: 10, risk: 9, speed: 7 }, next: 's2a', feedback: 'Responsible and user-first decision. Integrity over optics.' },
            { id: 'b', text: 'Launch anyway — security is a "known risk"', score: { accuracy: 0, logic: 1, risk: 0, speed: 10 }, next: 's2b', feedback: 'This could lead to legal liability, data breach, and product death.' },
            { id: 'c', text: 'Launch web only, delay mobile', score: { accuracy: 7, logic: 7, risk: 7, speed: 8 }, next: 's2a', feedback: 'Good mitigation — partial launch reduces risk.' },
          ],
        },
        {
          id: 's2a',
          scene: 'Investors are frustrated. They invested expecting a tomorrow launch. How do you handle the call?',
          choices: [
            { id: 'a', text: 'Present data: bug severity, fix timeline, revised plan with confidence', score: { accuracy: 10, logic: 10, risk: 9, speed: 9 }, next: 's3', feedback: 'Investors respect transparency and data-driven decisions.' },
            { id: 'b', text: 'Minimize the issue — say it is a "minor delay"', score: { accuracy: 2, logic: 2, risk: 3, speed: 8 }, next: 's3', feedback: 'Minimize now, lose trust forever. Bad long-term strategy.' },
            { id: 'c', text: 'Let the CEO handle it', score: { accuracy: 3, logic: 3, risk: 5, speed: 5 }, next: 's3', feedback: 'As PM you should own product decisions, not hide.' },
          ],
        },
        {
          id: 's2b',
          scene: 'Auth bug is exploited 6 hours after launch. 1,200 user accounts are compromised. Press coverage is negative.',
          choices: [
            { id: 'a', text: 'Emergency patch, notify affected users, public statement', score: { accuracy: 9, logic: 9, risk: 8, speed: 7 }, next: 's3', feedback: 'Correct crisis response — speed and transparency matter.' },
            { id: 'b', text: 'Take app offline and issue no statement yet', score: { accuracy: 5, logic: 4, risk: 5, speed: 6 }, next: 's3', feedback: 'Silence looks like a cover-up.' },
            { id: 'c', text: 'Blame QA publicly', score: { accuracy: 0, logic: 0, risk: 0, speed: 5 }, next: 's3', feedback: 'Never blame your team publicly. Leadership owns outcomes.' },
          ],
        },
        {
          id: 's3',
          scene: 'Bug is fixed. You do a retrospective. What do you propose to prevent this?',
          choices: [
            { id: 'a', text: 'Mandatory security review gates, staging environment testing, launch checklist', score: { accuracy: 10, logic: 10, risk: 10, speed: 8 }, next: null, feedback: 'Systematic prevention — this is product leadership.' },
            { id: 'b', text: 'Hire more QA engineers', score: { accuracy: 5, logic: 5, risk: 5, speed: 7 }, next: null, feedback: 'People help, but process gaps remain.' },
            { id: 'c', text: 'Move on — it was a one-time issue', score: { accuracy: 0, logic: 0, risk: 0, speed: 10 }, next: null, feedback: 'Without systematic fixes, this will repeat.' },
          ],
        },
      ],
    },
  ],

  Arts: [
    {
      id: 'arts-1',
      title: 'Brand Campaign Disaster',
      description: 'You are a Creative Director. Your agency\'s campaign for a major client launched and received massive backlash online.',
      domain: 'Arts',
      difficulty: 'Medium',
      timeLimit: 300,
      steps: [
        {
          id: 's1',
          scene: '🎨 Your ad campaign is trending — but for wrong reasons. Thousands of comments accuse it of cultural insensitivity. Client is calling. First move?',
          choices: [
            { id: 'a', text: 'Pause the campaign, assemble crisis team, review the specific complaints', score: { accuracy: 10, logic: 10, risk: 9, speed: 8 }, next: 's2a', feedback: 'Pause + listen is the right crisis instinct.' },
            { id: 'b', text: 'Defend the work publicly — creative vision should not be censored', score: { accuracy: 1, logic: 1, risk: 0, speed: 7 }, next: 's2b', feedback: 'Defending insensitive work amplifies the backlash.' },
            { id: 'c', text: 'Delete all content silently', score: { accuracy: 3, logic: 3, risk: 4, speed: 9 }, next: 's2b', feedback: 'The internet never forgets — screenshots already spread.' },
          ],
        },
        {
          id: 's2a',
          scene: 'After review, you confirm the campaign imagery inadvertently mocked a cultural tradition. The client wants a response in 2 hours.',
          choices: [
            { id: 'a', text: 'Write a genuine apology: acknowledge harm, commit to change, explain next steps', score: { accuracy: 10, logic: 10, risk: 9, speed: 8 }, next: 's3', feedback: 'Authentic accountability rebuilds trust faster.' },
            { id: 'b', text: '"We did not intend any offense" — and move on', score: { accuracy: 3, logic: 3, risk: 4, speed: 8 }, next: 's3', feedback: '"Not intended" statements often feel dismissive.' },
            { id: 'c', text: 'Hire a PR firm and say nothing yet', score: { accuracy: 4, logic: 4, risk: 5, speed: 3 }, next: 's3', feedback: 'Delays worsen social media crises — act fast.' },
          ],
        },
        {
          id: 's2b',
          scene: 'Backlash intensifies. Influencers amplify it. Client threatens to terminate the contract. What do you offer?',
          choices: [
            { id: 'a', text: 'Propose a make-good: new campaign that celebrates the culture, at no cost', score: { accuracy: 9, logic: 9, risk: 8, speed: 8 }, next: 's3', feedback: 'Turning the negative into a redemptive story.' },
            { id: 'b', text: 'Offer a refund and part ways', score: { accuracy: 5, logic: 5, risk: 5, speed: 6 }, next: 's3', feedback: 'Valid but loses future revenue and damages reputation.' },
            { id: 'c', text: 'Blame the junior designer who made the artwork', score: { accuracy: 0, logic: 0, risk: 0, speed: 5 }, next: 's3', feedback: 'Leadership owns creative output — never throw team under the bus.' },
          ],
        },
        {
          id: 's3',
          scene: 'Crisis resolved. You implement new creative review processes. What matters most?',
          choices: [
            { id: 'a', text: 'Diverse review panel before any campaign goes live, cultural sensitivity training', score: { accuracy: 10, logic: 10, risk: 10, speed: 8 }, next: null, feedback: 'Systemic change — this is the mark of a true creative leader.' },
            { id: 'b', text: 'Add one more approval round', score: { accuracy: 4, logic: 4, risk: 4, speed: 7 }, next: null, feedback: 'Process alone without diversity in review is insufficient.' },
            { id: 'c', text: 'Be more careful next time', score: { accuracy: 1, logic: 1, risk: 1, speed: 9 }, next: null, feedback: '"Be careful" is not a system — define specific actions.' },
          ],
        },
      ],
    },
  ],
};
