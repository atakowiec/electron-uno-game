from typing import List
from cards_data import cards_data


class Card:
    def __init__(self, id: str, base_card=None):
        data = cards_data.get(id)

        self.id: str = id
        self.type: str = data.get('type')
        self.color: str = data.get('color')
        self.rank: str = data.get('rank')
        self.special: bool = data.get('special', False)
        self.value: int = data.get('value', 0)
        self.active: bool = data.get('active', False)
        self.combo_down: List[str] = data.get('comboDown', [])
        self.combo_up: List[str] = data.get('comboUp', [])
        self.combo_both: List[str] = data.get('comboBoth', [])

        # base card holds the original card data (the variants will back to this)
        self.base_card: Card | None = base_card
        self.variants = {variant: Card(variant, self) for variant in data.get('variants', [])}

    def __str__(self):
        return self.id

    def __repr__(self):
        return self.id

    def get_variant(self, variant: str):
        if variant in self.variants:
            return self.variants[variant]
        return self

    def get_base(self):
        if self.base_card:
            return self.base_card
        return self

    def one_hot_encoded(self) -> List[int]:
        """One-hot encode the card."""
        encoding = [0] * len(cards_data)
        if self.id in cards_data:
            index = list(cards_data.keys()).index(self.id)
            encoding[index] = 1
        return encoding
