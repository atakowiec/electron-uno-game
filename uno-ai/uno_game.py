from typing import List

from ai_player import AiPlayer
from card import Card
from cards_data import cards_data
from possible_actions import possible_actions
from uno_player import UnoPlayer


class UnoGame:
    def __init__(self):
        self.players: List[UnoPlayer] = []
        self.stack: List[Card] = []
        self.deck: List[Card] = []
        self.direction: int = 1
        self.current_value: int = 0

        self.current_player_index: int = 0
        self.winners: List[UnoPlayer] = []
        self.prepare_game()

    def prepare_game(self):
        self.players.append(AiPlayer(self, 0))
        self.players.append(AiPlayer(self, 1))
        self.players.append(AiPlayer(self, 2))
        self.players.append(AiPlayer(self, 3))

        self.generate_deck()
        self.shuffle_deck()
        self.deal_cards()

    def start(self):
        self.play()

        self.end_game()

    def generate_deck(self):
        for card_id, data in cards_data.items():
            if not data.get("inDeck", True):
                continue

            self.deck.append(Card(card_id))

    def shuffle_deck(self):
        for i in range(len(self.deck)):
            self.deck[i] = self.deck[i].get_base()

        import random
        random.shuffle(self.deck)

    def deal_cards(self):
        cards_per_player = 7
        for player in self.players:
            player.hand = self.deck[:cards_per_player]
            self.deck = self.deck[cards_per_player:]
            cards_per_player -= 1

        # get the first card from deck that is not a special card
        for i, card in enumerate(self.deck):
            if not card.special:
                self.stack.append(card)
                self.deck.pop(i)
                break

    def play(self):
        i = -1
        while not self.check_game_end():
            i = (i + self.direction) % len(self.players)
            # iterate through players in the game

            player = self.players[i]
            if not player.hand:
                print(f"Player {player.name} has no cards left!")
                continue

            player.turn()

    def play_cards(self, player: UnoPlayer):
        for card in player.selected_cards:
            self.stack.append(card)

            if card.value and card.value > 0:
                self.current_value += card.value

            if card.rank == "reverse":
                self.direction *= -1

        player.selected_cards.clear()

        if not player.hand:
            print(f"Player {player.name} has won the game! after {player.current_turn} turns")
            self.winners.append(player)
            self.players.remove(player)
            return

    def draw_card(self, player: UnoPlayer):
        if not self.deck:
            self.deck = self.stack[:-1]
            self.stack = [self.stack[-1]]
            self.shuffle_deck()

        if not self.deck:
            print("no cards left")
            return None

        card = self.deck.pop(0)
        player.hand.append(card)
        return card

    def end_game(self):
        print("Game Over!")

    def get_top_card(self):
        if self.stack:
            return self.stack[-1]
        return None

    def check_game_end(self):
        if len(self.players) < 2:
            print("Not enough players to continue the game.")
        return len(self.players) < 2

    def get_encoded_state(self):
        return self.players[self.current_player_index].get_encoded_state()

    def play_action(self, action_idx: int):
        player = self.players[self.current_player_index]
        actions = player.get_actions()

        if action_idx < 0 or action_idx >= len(possible_actions):
            print(f"Invalid action index: {action_idx}")
            return -10, self.check_game_end()

        action = possible_actions[action_idx]

        if action not in actions:
            return -10, self.check_game_end()

        reward = player.perform_action(action)

        if player.turn_completed:
            self.current_player_index = (self.current_player_index + self.direction) % len(self.players)

        return reward, self.check_game_end()
