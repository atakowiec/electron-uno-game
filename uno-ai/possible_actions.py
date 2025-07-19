from cards_data import cards_data

possible_actions = []

for id, card in cards_data.items():
    if card.get("inDeck", True) is False:
        continue

    if card["color"] == "chosen":
        for variant in card["variants"]:
            possible_actions.append(f"play:{id}:{variant}")
    else:
        possible_actions.append(f"play:{id}")

possible_actions.append("draw_card")
possible_actions.append("pass")
possible_actions.append("accept")
possible_actions.append("reset")
