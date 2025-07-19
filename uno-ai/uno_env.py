import gymnasium as gym
import numpy as np
from gymnasium import spaces

from cards_data import cards_data
from possible_actions import possible_actions
from uno_game import UnoGame

cards_length = len(cards_data)
OBS_SIZE = (cards_length + cards_length + cards_length + 1 + 1 + 1 + 1 + 1 + 3 + 1 + 5 + 1 + 1 + 1 +
            len(possible_actions))

HIGH = [1] * (3 * cards_length + 5) + [100] * 9 + [4, 4, 1000] + [1] * len(possible_actions)
HIGH = np.array(HIGH, dtype=np.int32)

LOW = np.array([0] * OBS_SIZE, dtype=np.int32)


class UnoEnv(gym.Env):
    def __init__(self):
        super().__init__()
        self.game = None
        self.action_space = spaces.Discrete(len(possible_actions))  # total unique actions
        self.observation_space = spaces.Box(low=LOW, high=HIGH, shape=(OBS_SIZE,), dtype=np.int32)

    def reset(self, **kwargs):
        self.game = self._start_new_game()
        return self._get_observation(), {}

    def step(self, action):
        reward, done = self._apply_action(action)
        obs = self._get_observation()
        return obs, reward, done, False, {}

    def _get_observation(self):
        state = self.game.get_encoded_state()
        return np.array(state, dtype=np.int32)

    def _apply_action(self, action_idx):
        reward, done = self.game.play_action(action_idx)

        if not self.game.deck:
            done = True

        return reward, done

    def _start_new_game(self):
        return UnoGame()
