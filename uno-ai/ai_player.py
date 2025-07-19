from typing import List

from card import Card
from cards_data import cards_data
from uno_player import UnoPlayer


class AiPlayer(UnoPlayer):
    def __init__(self, game, index: int):
        super().__init__(game, index)
        self.name = f"ai-{index}"

    def print(self, message: str, end="\n"):
        pass

    def make_move(self):
        pass

    def get_colors_in_hand(self) -> list[int]:
        colors = {
            "red": 0,
            "green": 0,
            "blue": 0,
            "yellow": 0,
            "chosen": 0,
        }
        for card in self.hand:
            if card.color not in colors:
                print("Unknown color in hand:", card.color)
                continue
            colors[card.color] += 1
        return list(colors.values())

    def one_hot_encode_cards(self, cards: List[Card]) -> List[int]:
        """One-hot encode a list of cards."""
        encoding = [0] * len(cards_data)
        for card in cards:
            if card.id in cards_data:
                index = list(cards_data.keys()).index(card.id)
                encoding[index] = 1
        return encoding

    def one_hot_encoded_actions(self, actions: List[str]) -> List[int]:
        from possible_actions import possible_actions

        action_encoding = [0] * len(possible_actions)
        for action in actions:
            if action in possible_actions:
                index = possible_actions.index(action)
                action_encoding[index] = 1
            else:
                print(f"Unknown action: {action}")

        return action_encoding

    def get_encoded_state(self):
        actions = self.get_actions()

        must_pass = actions == ["pass"]
        top_card = self.get_top_card()
        can_stack = any(
            card.rank == top_card.rank and card.value > 0 and (self.selected_cards or self.game.current_value) for card
            in self.get_cards(None, None))

        return (top_card.one_hot_encoded()
                + self.one_hot_encode_cards(self.hand)
                + self.one_hot_encode_cards(self.selected_cards)
                + [not not self.selected_cards]
                + [self.blocked_rounds]
                + [self.resets]
                + [must_pass]
                + [can_stack]
                + self.get_other_hands() + [0] * len(self.game.winners)
                + [self.game.current_value]
                + self.get_colors_in_hand()
                + [self.game.players.index(self)]
                + [len(self.game.players)]
                + [self.current_turn]
                + self.one_hot_encoded_actions(actions))
