from app.models.question import Question

def score_question(question: Question, user_answers: list[str]):
    answers = question.answers
    max_score = 1.0
    score = 0.0

    if question.type == "multiple":
        correct = next(a.label for a in answers if a.is_correct)
        score = 1.0 if user_answers == [correct] else 0.0

    elif question.type == "checkbox":
        correct_labels = [a.label for a in answers if a.is_correct]
        if not correct_labels:
            return 0.0, 1.0

        point_per_answer = 1.0 / len(correct_labels)
        for label in user_answers:
            if label in correct_labels:
                score += point_per_answer

    elif question.type == "ranking":
        correct_order = sorted(answers, key=lambda a: a.rank_order)
        correct_labels = [a.label for a in correct_order]

        point_per_rank = 1.0 / len(correct_labels)
        for idx, label in enumerate(user_answers):
            if idx < len(correct_labels) and label == correct_labels[idx]:
                score += point_per_rank

    return round(score, 2), max_score
