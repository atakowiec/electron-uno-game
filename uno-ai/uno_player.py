from abc import abstractmethod, ABC
from typing import List
from card import Card


class UnoPlayer(ABC):

    def __init__(self, game, index: int):
        from uno_game import UnoGame

        self.game: UnoGame = game
        self.hand: List[Card] = []
        self.selected_cards: List[Card] = []
        self.blocked_rounds: int = 0
        self.combo_direction: int = 0  # 1 for up, -1 for down, 0 for no combo
        self.turn_completed = False
        self.resets = 0
        self.name = f"player-{index}"
        self.current_turn = 1

        self.actions = []

    def turn(self):
        self.turn_completed = False
        print(f"Player {self.name}")
        self.make_move()

        if not self.turn_completed:
            self.turn()

    @abstractmethod
    def make_move(self):
        pass

    def read_action(self, actions: List[str]) -> str:
        action = -1
        while True:
            val = input()

            if not val.isnumeric():
                self.print("Podaj liczbę!")
                continue

            action = int(val)

            if 0 <= action < len(actions):
                break

            self.print("Nieprawidłowy zakres!")

        return actions[action]

    def get_actions(self):
        if self.blocked_rounds > 0:
            self.blocked_rounds -= 1
            return ["pass"]

        actions = []
        if self.selected_cards:
            actions.append('accept')
            actions.append('reset')

        # handle block card
        top_card = self.get_top_card()
        if self.game.current_value > 0:
            # it means there is a block or a plus card on the stack and the player has to play a card or pass
            actions.append('pass')
        elif not self.selected_cards:
            actions.append('draw_card')

        for card in self.get_cards(None, None):
            if self.can_play(top_card, card):
                if card.color == 'chosen':
                    for variant in card.variants:
                        actions.append(f"play:{card.id}:{variant}")
                else:
                    actions.append(f"play:{card.id}")

        self.actions = actions  # cache actions for later use in this turn
        return actions

    def has_card(self, color: str | None, rank: str | None) -> bool:
        return len(self.get_cards(color, rank)) > 0

    def get_cards(self, color: str | None, rank: str | None) -> List[Card]:
        return [card for card in self.hand if
                (color is None or card.color == color) and
                (rank is None or card.rank == rank) and
                (card not in self.selected_cards)]

    def get_top_card(self) -> Card:
        if self.selected_cards:
            return self.selected_cards[-1]
        return self.game.get_top_card()

    def get_other_hands(self):
        player_index = self.game.players.index(self)

        res = []
        for _ in range(len(self.game.players) - 1):
            player_index = (player_index + self.game.direction) % len(self.game.players)
            res.append(len(self.game.players[player_index].hand))

        return res

    def perform_action(self, action: str):
        self.turn_completed = False
        [action, card_id, variant] = (action.split(":") + [""] * 3)[:3]

        if action == "play":
            self.play_card(card_id, variant)
            return 0.5 + len(self.selected_cards) * 0.2

        if action == "pass":
            return self.action_pass()

        if action == "draw_card":
            return self.draw_card()

        if action == "accept":
            return self.accept()

        if action == "reset":
            self.reset()
            return 0.1 - self.resets * 0.05

        return 0

    def can_play(self, top_card: Card, card: Card) -> bool:
        # if already is a combo - player can only play cards allowed for combo
        if self.selected_cards:
            self.print(f"{card} - combo")
            return ((self.combo_direction >= 0 and card.type in top_card.combo_up) or
                    (self.combo_direction <= 0 and card.type in top_card.combo_down) or
                    (card.type in top_card.combo_both))

        # if the last card is active block - player can only play another block
        if self.game.current_value > 0 and top_card.rank == "block":
            self.print(f"{card} - block")
            return card.rank == "block"

        # with plus same as above
        if self.game.current_value > 0 and top_card.rank == "plus":
            self.print(f"{card} - plus")
            return card.rank == "plus"

        # and then handle just playing card
        return card.color == top_card.color or card.rank == top_card.rank or card.color == 'chosen'

    def play_card(self, card_id: str, card_variant: str):
        card = next((c for c in self.hand if c.id == card_id), None).get_variant(card_variant)
        self.print(f"playing {card}")

        # if it's not a first card in the combo, determine the combo direction
        if self.selected_cards:
            last_selected = self.selected_cards[-1]
            if card.type in last_selected.combo_up:
                self.combo_direction = 1
            elif card.type in last_selected.combo_down:
                self.combo_direction = -1

        self.hand.remove(card.get_base())
        self.selected_cards.append(card)

    def action_pass(self):
        top_card = self.get_top_card()
        if top_card.rank == "block":
            self.print(f"block for {self.game.current_value} rounds")
            self.blocked_rounds = self.game.current_value
            self.game.current_value = 0

        if top_card.rank == "plus":
            self.print(f"drawing {self.game.current_value} cards")
            for i in range(self.game.current_value):
                self.game.draw_card(self)

            self.game.current_value = 0

        self.end_turn()
        return -0.5 if self.actions != ["pass"] else 0.1

    def draw_card(self):
        card = self.game.draw_card(self)
        self.print(f"drawing {card}")
        self.end_turn()

        return 0.1 if self.actions == ["draw_card"] else -len(self.actions)

    def accept(self):
        self.print(f"playing {self.selected_cards}")
        cards = len(self.selected_cards)
        self.game.play_cards(self)
        self.end_turn()

        reward = 0.5 + cards * 0.2

        if not self.hand:
            won_players = len([p for p in self.game.players if not p.hand]) - 1
            reward += 100 - won_players * 20

        return reward

    def reset(self):
        self.print(f"resetting {self.selected_cards}")
        self.reset_selected_cards()
        self.resets += 1

    def end_turn(self):
        self.turn_completed = True
        self.resets = 0
        self.current_turn += 1

        # append all selected cards to the hand
        self.reset_selected_cards()

    def reset_selected_cards(self):
        # add all selected cards to the hand
        for card in self.selected_cards:
            if card not in self.hand:
                self.hand.append(card.get_base())

        self.selected_cards.clear()

    @abstractmethod
    def print(self, message: str, end="\n"):
        print(message, end=end)

    def get_encoded_state(self):
        return []
