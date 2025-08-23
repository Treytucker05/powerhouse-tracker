#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const file = path.join(root, 'data', 'extraction', 'templates_additions.csv');
const HEADER = ['id', 'display_name', 'category', 'goal', 'days_per_week', 'scheme', 'supplemental', 'assistance_mode', 'assistance_targets', 'conditioning_mode', 'time_per_session_min', 'time_per_week_min', 'leader_anchor_fit', 'pr_sets_allowed', 'jokers_allowed', 'amrap_style', 'deload_policy', 'seventh_week_default', 'tm_default_pct', 'tm_prog_upper_lb', 'tm_prog_lower_lb', 'equipment', 'population', 'seasonality', 'constraints', 'experience', 'book', 'pages', 'notes', 'tags'];

function csvEscape(v) {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

const rows = [];

function rowMass() {
    const r = {};
    r.id = 'powerlifting2011__off-season-for-mass';
    r.display_name = 'Off-season for mass';
    r.category = 'Powerlifting';
    r.goal = 'mass';
    r.days_per_week = '4';
    r.scheme = '531';
    r.supplemental = '';
    r.assistance_mode = 'hypertrophy';
    r.assistance_targets = 'shoulders, lats/upper back, posterior chain, quads, arms, abs';
    r.conditioning_mode = 'easy prowler / long walks / light strongman / weighted-vest hills';
    r.time_per_session_min = '';
    r.time_per_week_min = '';
    r.leader_anchor_fit = '';
    r.pr_sets_allowed = 'false';
    r.jokers_allowed = '';
    r.amrap_style = 'required reps only';
    r.deload_policy = 'Week 4 deload 40/50/60×5';
    r.seventh_week_default = '';
    r.tm_default_pct = '0.9';
    r.tm_prog_upper_lb = '5';
    r.tm_prog_lower_lb = '10';
    r.equipment = '';
    r.population = 'powerlifters';
    r.seasonality = 'off-season';
    r.constraints = '';
    r.experience = '';
    r.book = '5/3/1 for Powerlifting (2011)';
    r.pages = '25–27; 11; 9–10; 16';
    r.notes = 'Press/bench add 1 drop set of 10–15; squat add 1 drop set of 20; superset all pressing with chins/lat pulldowns; BBB recommended; conditioning kept easy so mass work isn’t compromised.';
    r.tags = 'frequency:4d|scheme:531|template:powerlifting|season:off|prs:no|goal:hypertrophy';
    return r;
}

function rowStrength() {
    const r = {};
    r.id = 'powerlifting2011__off-season-template-for-strength';
    r.display_name = 'Off-season template for strength';
    r.category = 'Powerlifting';
    r.goal = 'strength';
    r.days_per_week = '4';
    r.scheme = '531';
    r.supplemental = '';
    r.assistance_mode = '';
    r.assistance_targets = '';
    r.conditioning_mode = 'prowler';
    r.time_per_session_min = '';
    r.time_per_week_min = '';
    r.leader_anchor_fit = '';
    r.pr_sets_allowed = 'true';
    r.jokers_allowed = '';
    r.amrap_style = '';
    r.deload_policy = '';
    r.seventh_week_default = '';
    r.tm_default_pct = '';
    r.tm_prog_upper_lb = '';
    r.tm_prog_lower_lb = '';
    r.equipment = 'barbell|dumbbells|prowler';
    r.population = 'powerlifter';
    r.seasonality = 'off-season';
    r.constraints = '';
    r.experience = '';
    r.book = '5/3/1 for Powerlifting (2011)';
    r.pages = '28–30';
    r.notes = 'Less assistance, more main work and PR attempts; pick battles; sample Prowler prescriptions; conditioning hard on lower days, easy on upper days.';
    r.tags = 'frequency:4d|scheme:531|template:powerlifting|goal:strength|prs:yes|season:off';
    return r;
}

function rowConditioning() {
    const r = {};
    r.id = 'powerlifting2011__off-season-template-for-conditioning';
    r.display_name = 'Off-season template for conditioning';
    r.category = 'Powerlifting';
    r.goal = 'conditioning';
    r.days_per_week = '4';
    r.scheme = '531';
    r.supplemental = '';
    r.assistance_mode = '';
    r.assistance_targets = '';
    r.conditioning_mode = 'prowler|hill_sprints|stadium_stairs';
    r.time_per_session_min = '';
    r.time_per_week_min = '';
    r.leader_anchor_fit = '';
    r.pr_sets_allowed = '';
    r.jokers_allowed = '';
    r.amrap_style = '';
    r.deload_policy = '';
    r.seventh_week_default = '';
    r.tm_default_pct = '';
    r.tm_prog_upper_lb = '';
    r.tm_prog_lower_lb = '';
    r.equipment = 'barbell|dumbbells|prowler';
    r.population = 'powerlifter';
    r.seasonality = 'off-season';
    r.constraints = '';
    r.experience = '';
    r.book = '5/3/1 for Powerlifting (2011)';
    r.pages = '31–33';
    r.notes = "Prioritize conditioning; main lift often only required reps; back off TM; optional AM conditioning; Prowler 10×40 yd @90 lb/1' rest; hard post-lift work.";
    r.tags = 'frequency:4d|scheme:531|template:powerlifting|goal:conditioning|season:off';
    return r;
}

function toLine(obj) {
    return HEADER.map(k => csvEscape(obj[k] ?? '')).join(',');
}

try {
    // Write normalized content with only these three rows
    const outLines = [HEADER.join(','), toLine(rowMass()), toLine(rowStrength()), toLine(rowConditioning())];
    fs.writeFileSync(file, outLines.join('\n') + '\n', 'utf8');
    console.log('templates_additions.csv normalized with 3 rows.');
} catch (e) {
    console.error('Failed to normalize:', e.message);
    process.exit(1);
}
