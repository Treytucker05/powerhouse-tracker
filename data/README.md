# Data Directory

Place raw data assets here.

## exercise_database.csv
Expected columns (header row required):
```
exercise,category,equipment,default_sets,default_reps,progression_rule,notes,source
```
- `exercise`: Unique exercise display name
- `category`: Movement pattern (Push, Pull, Core, Single-Leg, Posterior, Arms, Carry, Conditioning, Other)
- `equipment`: Comma-separated tags (e.g. "barbell,dumbbell,bodyweight")
- `default_sets`: Suggested base sets (e.g. "3" or "5")
- `default_reps`: Suggested rep prescription (e.g. "10-12", "AMRAP 50", "5", "8-10")
- `progression_rule`: Short rule key (e.g. "linear_load", "rep_progression", "quality_volume")
- `notes`: Coaching / execution notes (concise)
- `source`: Reference or origin (book, coach, article)

Example row:
```
Chin-ups,Pull,bodyweight,5,AMRAP,rep_progression,Full stretch / chest to bar intent,Wendler 5/3/1
```
