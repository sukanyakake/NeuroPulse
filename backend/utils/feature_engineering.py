def build_features(day):
    screen = day.get("screen_time", 0)
    sleep = day.get("sleep", 0)
    steps = day.get("steps", 0)
    unlocks = day.get("unlocks", 0)
    mood = day.get("mood", 3)

    sleep_deficit = 8 - sleep
    activity_score = steps / 10000
    screen_intensity = screen / 10
    mood_inversion = 5 - mood

    return [
        screen,
        sleep,
        steps,
        unlocks,
        mood,
        sleep_deficit,
        activity_score,
        screen_intensity,
        mood_inversion
    ]