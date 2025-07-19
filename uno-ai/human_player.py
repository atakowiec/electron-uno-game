from uno_player import UnoPlayer


class HumanPlayer(UnoPlayer):
    def __init__(self, game, index: int):
        super().__init__(game, index)
        self.name = f"human-{index}"

    def print(self, message: str, end="\n"):
        print(message, end=end)

    def make_move(self):
        actions = self.get_actions()

        data = {
            "top": self.get_top_card(),
            "hand": self.hand,
            "selected_cards": self.selected_cards,
            "blocked_rounds": self.blocked_rounds,
            "other_hands": self.get_other_hands(),
            "current_value": self.game.current_value,
            "actions": actions,
        }

        self.print("--------------------------------------")
        for key, value in data.items():
            self.print(f"{key}: {value}")
        self.print("")
        self.print(f"choose action [0-{len(actions) - 1}]: ", end="")
        action = self.read_action(actions)
        self.print(f"selected: {action}")
        self.print("")
        self.perform_action(action)
        self.print("--------------------------------------")
