// The events, written from the I++ EVENTS 2026 document, which gives each event's format, rounds, timings and rules. The dates and
// venues were added afterwards (all on 24 October 2026). A `prize` and `contacts` are still to come: the popup shows them once set.
export type Category = "technical" | "non-technical";
export type Line = { label?: string; text: string };
export type Section = { heading?: string; lines: Line[] };
export type EventInfo = {
  slug: string; // also the name of its art file, /art/events/<slug>.webp
  title: string;
  category: Category;
  tagline: string;
  accent: string; // the card art's main colour
  date: string | null;
  time: string;
  team: string;
  venue: string | null;
  prize?: string;
  contacts?: { name: string; phone: string }[];
  sections: Section[];
};

export const EVENTS: readonly EventInfo[] = [
  {
    slug: "logic-lockdown",
    title: "Logic Lockdown",
    category: "technical",
    tagline: "Basic logic, tested twice.",
    accent: "#9a4df0",
    date: "24 October 2026",
    time: "Round 1: 10 am – 1 pm · Round 2: 2 pm – 3:30 pm",
    team: "2 – 3 members",
    venue: "2nd Floor Classroom, IST dept", // no break inside "IST dept" where the line wraps
    sections: [
      { lines: [{ label: "Introduction", text: "This event focuses on basic logic-building skills. It evaluates problem-solving ability and helps boost placement-related learning." }] },
      {
        heading: "Round 1",
        lines: [
          { label: "Duration", text: "30 minutes, any time between 10 am and 1 pm" },
          { label: "Questions", text: "MCQs on basic DSA concepts plus debugging questions that test your grasp of time and space complexity." },
        ],
      },
      {
        heading: "Round 2",
        lines: [
          { label: "Duration", text: "1.5 hours (2 pm to 3:30 pm)" },
          { label: "Task", text: "A mixed set of questions covering all data structures. Build the solution and prove it with a dry run example." },
        ],
      },
      { lines: [{ label: "Format", text: "Offline, in a classroom. Answers are written on the question paper." }] },
    ],
  },
  {
    slug: "brainbid",
    title: "BrainBid",
    category: "technical",
    tagline: "Bid big. Answer right.",
    accent: "#f8b733",
    date: "24 October 2026",
    time: "9:30 am – 3:30 pm, including tie-breakers",
    team: "1 – 2 members",
    venue: "Ground Floor Classroom",
    sections: [
      {
        lines: [
          {
            label: "Introduction",
            text: "BrainBid is an interactive quiz that mixes knowledge, strategy and decision-making. Teams bid points for the chance to answer MCQs on aptitude, logical reasoning, analytical thinking and problem-solving. The options are revealed only after the bidding, so you have to weigh your confidence and take calculated risks.",
          },
        ],
      },
      {
        heading: "Round 1 · BrainBid Challenge",
        lines: [
          { label: "Format", text: "One offline round: a bidding-based quiz with tie-breakers." },
          { label: "Bidding", text: "Every team starts with 1,000 points and can bid at most 100 on a question. The question is shown without its options, and the highest bidder gets to answer. Equal bids go to a tie-breaker." },
          { label: "Scoring", text: "A correct answer earns +20 and a wrong one costs −20. Bidding points only buy the chance to answer; they do not count towards the final score." },
          { label: "Winner", text: "The highest score after all the questions. A rapid-fire round settles any tie." },
        ],
      },
      { lines: [{ label: "Judging", text: "Accuracy of answers 50% · Strategic bidding 25% · Logical thinking 15% · Team coordination 10%." }] },
      { lines: [{ label: "Why join", text: "Sharpen aptitude and logical reasoning, practise risk assessment and quick decisions, and enjoy a quiz that feels like an auction." }] },
    ],
  },
  {
    slug: "optimization-arena",
    title: "The Optimization Arena",
    category: "technical",
    tagline: "Don’t just solve it. Solve it well.",
    accent: "#2ccbdc",
    date: "24 October 2026",
    time: "9:30 am – 3:30 pm",
    team: "2 – 3 members",
    venue: "2nd Floor Lab",
    sections: [
      {
        lines: [
          {
            label: "Introduction",
            text: "Most contests ask “can you solve it?” The Optimization Arena asks “can you solve it well?” You get programs that already work but are slow, repetitive or badly structured. Diagnose what is wrong, rebuild the code with better time and space complexity, then prove it live against other teams. It covers DSA, DBMS, OOP and complexity analysis.",
          },
        ],
      },
      {
        heading: "Round 1 · Legacy Code Autopsy",
        lines: [
          { label: "Duration", text: "9:30 am – 12:00 pm" },
          { label: "Task", text: "Read the legacy code, find its inefficiencies and rewrite it to be correct, faster or leaner and cleaner, with identical behaviour. Comment the old and new complexity and fill in a half-page Autopsy Report: the cause of the slowness, complexity before and after, the technique used and one accepted trade-off." },
          { label: "Landmines", text: "Each program hides 1 – 2 bugs, such as an off-by-one that only shows on large inputs. Find and fix them for +3 to +5 bonus points each." },
          { label: "Scoring", text: "Correctness 30 · Performance gain 30 · Autopsy report 20 · Code quality 20, plus the landmine bonus. The top 5 – 8 teams move on." },
        ],
      },
      {
        heading: "Round 2 · Live Optimization Duel",
        lines: [
          { label: "Duration", text: "1:30 pm – 2:30 pm" },
          { label: "Task", text: "Shortlisted teams solve the same, harder problem live on the projector. Submissions run against hidden and stress cases, and a Live Complexity Meter shows each team’s runtime improving with every resubmission. Mid-round the judges change a constraint, for example input is now 10⁷ and memory is capped at 64 MB. The first correct, most optimized solution wins, and the leader must defend its complexity in a Big-O viva." },
          { label: "Power-ups", text: "Hint (+5 minute penalty), Test Peek (+3 minutes), Freeze your own timer for 60 seconds (+4 minutes)." },
        ],
      },
      { lines: [{ label: "Rules", text: "Rewritten code must behave like the original. No internet, phones or AI tools. Lab systems are provided and laptops are not permitted. No sharing code; plagiarism checks apply. The judges’ decision is final." }] },
    ],
  },
  {
    slug: "debug-dealers",
    title: "Debug Dealers",
    category: "technical",
    tagline: "Buy shady code. Fix it fast.",
    accent: "#f1503f",
    date: "24 October 2026",
    time: "Round 1: 45 minutes · Round 2: 90 minutes",
    team: "2 – 3 members",
    venue: "1st Floor Lab",
    sections: [
      {
        lines: [
          {
            label: "Introduction",
            text: "Debug Dealers, the Code Black Market, is a two-round coding event in which teams play underground developers. Earn “Black Credits”, spend them in a secret code market and turn the shady modules you buy into one working application. Every module can hide bugs, so buying cleverly matters, but fixing quickly matters even more.",
          },
        ],
      },
      {
        heading: "Round 1 · Code Smuggling",
        lines: [
          { label: "Duration", text: "45 minutes" },
          { label: "Task", text: "Solve a challenge sheet that mixes useful, buggy and irrelevant code: easy programs, output prediction, missing code, sorting snippets as USEFUL, BUGGY or IRRELEVANT, finding errors and algorithmic problems." },
          { label: "Credits", text: "Each challenge has a fixed value in Black Credits. Full credits only for a fully correct answer, with half credits possible for partly correct debugging or algorithmic answers. There is no negative marking, and the first team to solve a challenge gets +20 bonus credits." },
        ],
      },
      {
        heading: "Round 2 · Black Market Deal",
        lines: [
          { label: "Duration", text: "90 minutes" },
          { label: "Task", text: "Build a Student Complaint Management System (log in, submit a complaint, store it, search earlier ones) from a starter application. Buy modules from a printed catalogue with your Round 1 credits, integrate them and fix every hidden bug: wrong names, missing imports, logic errors and compatibility issues." },
          { label: "Market rules", text: "A module can be bought once per team and is never refunded. Anything you do not buy you can write yourself, and bought modules can be edited freely." },
        ],
      },
      { lines: [{ label: "Scoring", text: "Out of 100: working features 40 · bugs found and fixed 25 · smart use of credits 10 · code quality 10 · testing and a 2-minute demo 15. Ties go to the team that fixed more planted bugs, then to the earlier submission." }] },
      { lines: [{ label: "Rules", text: "Phones switched off or handed to the volunteers. No sharing answers or modules. No internet, AI tools or copying: that means disqualification. Time limits are strict and the judges’ decision is final." }] },
    ],
  },
  {
    slug: "sequel",
    title: "Sequel",
    category: "technical",
    tagline: "From SELECT to solved.",
    accent: "#31d58f",
    date: "24 October 2026",
    time: "9:00 am – 4:00 pm",
    team: "1 – 2 members",
    venue: "2nd Floor Lab",
    sections: [
      {
        lines: [
          {
            label: "Introduction",
            text: "Sequel is an SQL event that tests database management, query writing and logical problem-solving. It combines multiple-choice questions with real-world SQL challenges covering DDL, DML, joins, subqueries, constraints, aggregate functions and output-based questions.",
          },
        ],
      },
      {
        heading: "Round 1 · SQL Quiz",
        lines: [
          { label: "Duration", text: "9:00 am – 12:30 pm" },
          { label: "Task", text: "MCQs on SQL fundamentals: analyze statements, predict their output and pick the correct queries. The highest scorers qualify for Round 2." },
        ],
      },
      {
        heading: "Round 2 · Query Solving",
        lines: [
          { label: "Duration", text: "2:00 pm – 4:00 pm" },
          { label: "Task", text: "Story-based, real-world SQL problems, each with a database schema. Write correct and optimized queries on the assigned platform. Points go to accuracy and optimization, time breaks ties, and the highest score in the least time wins." },
        ],
      },
      { lines: [{ label: "Judging", text: "Query accuracy · Technical knowledge · Query optimization · Time management." }] },
    ],
  },
  {
    slug: "cluedo",
    title: "Cluedo Live",
    category: "non-technical",
    tagline: "Who killed the mango milkshake?",
    accent: "#e84fae",
    date: "24 October 2026",
    time: "60 – 75 minutes, depending on team speed",
    team: "3 – 5 members",
    venue: "1st Floor Classroom",
    sections: [
      {
        lines: [
          {
            label: "Introduction",
            text: "Cluedo Live: The Case of the Murdered Milkshake turns you into a detective in a live-action murder mystery. Instead of chasing treasure, teams follow a cinematic storyline to solve a shocking case. Crime scenes, live suspect interrogations, riddles, fake clues and hilarious hindrances make it a thrilling, funny, completely non-technical experience.",
          },
        ],
      },
      {
        heading: "The case",
        lines: [
          { label: "Story", text: "At the grand college Food Fest, the beloved Mango Milkshake is found spilled, poisoned and dead. Who did it?" },
          { label: "Suspects", text: "Chef Chatterjee, Security Guard Shankar, Random Villager Radha, DJ Dev and Professor Puzzler." },
        ],
      },
      {
        heading: "Stages",
        lines: [
          { label: "1 · Crime scene", text: "Find the spilled milkshake and the first clue." },
          { label: "2 · Interrogations", text: "Question the suspects, solving riddles or silly tasks to get information." },
          { label: "3 · Clue puzzle", text: "Piece the collected clues together to reveal the real suspect." },
          { label: "4 · Final accusation", text: "Name the culprit. Only one team gets it right." },
        ],
      },
      { lines: [{ label: "Judging", text: "Correct identification of the culprit, then the fastest time to solve." }] },
      { lines: [{ label: "Format", text: "Offline, an interactive live-action game with one continuous, multi-stage storyline." }] },
    ],
  },
  {
    slug: "ipl-auction",
    title: "IPL Auction",
    category: "non-technical",
    tagline: "Quiz it. Bid it. Build it.",
    accent: "#4f80ff",
    date: "24 October 2026",
    time: "Round 1: 30 minutes · Round 2: 1.5 hours",
    team: "2 – 3 members",
    venue: "2nd Floor Classroom, IST dept", // no break inside "IST dept" where the line wraps
    sections: [
      {
        lines: [
          {
            label: "Introduction",
            text: "Test your knowledge of the Indian Premier League — teams, players, statistics and auction strategy — through an IPL quiz and a live IPL-style auction. It rewards cricket knowledge, decision-making, teamwork and strategic thinking.",
          },
        ],
      },
      {
        heading: "Round 1 · IPL Quiz Challenge",
        lines: [
          { label: "Duration", text: "30 minutes" },
          { label: "Task", text: "MCQs and scenario-based questions on IPL history, teams, players, records, statistics and auction rules. The scenario questions test strategic choices based on player performance, team needs and budget. Shortlisted teams move on." },
        ],
      },
      {
        heading: "Round 2 · Live IPL Auction",
        lines: [
          { label: "Duration", text: "1.5 hours" },
          { label: "Task", text: "Each team represents a franchise with a fixed budget and builds a squad by bidding for the players the auctioneer announces. Plan your budget, spot valuable players and follow the auction rules and squad requirements." },
          { label: "Winner", text: "Decided on squad composition, budget management and overall team strength." },
        ],
      },
      { lines: [{ label: "Judging", text: "IPL knowledge and quiz performance · Strategic bidding and player selection · Budget management · Squad balance and team strength · Coordination and decision-making." }] },
    ],
  },
  {
    slug: "enigma",
    title: "Enigma",
    category: "non-technical",
    tagline: "A carnival of riddles.",
    accent: "#ff8133",
    date: "24 October 2026",
    time: "Round 1: any time 10 am – 1 pm · Round 2: 1 hour",
    team: "2 – 4 members",
    venue: "Ada Lovelace Auditorium",
    sections: [
      { lines: [{ label: "Introduction", text: "A carnival event where teams move through a sequence of games, unlocking each one by solving a riddle. The fastest team qualifies." }] },
      {
        heading: "Round 1",
        lines: [
          { label: "Duration", text: "Any time between 10 am and 1 pm" },
          { label: "Task", text: "Pick a chit, solve its riddle, choose an event from the list and play it. Pick another chit and repeat until every event is done. The fastest completion qualifies." },
          { label: "Hollow Pyramid", text: "Arrange objects into a pyramid following the rules, within the time limit." },
          { label: "Whisper Wars", text: "Whisper a phrase down the team; the last player has to say the original phrase out loud." },
          { label: "Round & Round", text: "A challenge with circular movement or spinning objects, played by the rules and the clock." },
          { label: "Ball in the Basket", text: "Throw balls into a basket at a set distance and score as many as you can in the time." },
          { label: "Blow Away", text: "Use your breath alone to move light objects to the finish line." },
          { label: "Piece by Piece", text: "Assemble scattered pieces into a picture, pattern or puzzle within the time limit." },
        ],
      },
      {
        heading: "Round 2",
        lines: [
          { label: "Duration", text: "1 hour" },
          { label: "Task", text: "A theme-based challenge. Pick a genre to get your question set and solve three questions one by one: each answer leads to a hidden number chit in the room, and finding it unlocks the next question. After the third, burst a balloon to mark your finish. The fastest team wins." },
        ],
      },
    ],
  },
];

export type TabId = "all" | Category;

export const TABS: readonly { id: TabId; label: string; heading: string; frame: string }[] = [
  { id: "all", label: "All events", heading: "All Events", frame: "/art/events/cat-all.webp" },
  { id: "technical", label: "Technical events", heading: "Technical Events", frame: "/art/events/cat-tech.webp" },
  { id: "non-technical", label: "Non-technical events", heading: "Non-Technical Events", frame: "/art/events/cat-nontech.webp" },
];
