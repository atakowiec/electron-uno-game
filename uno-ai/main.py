from uno_env import UnoEnv

from stable_baselines3 import PPO
from stable_baselines3.common.env_checker import check_env

env = UnoEnv()
check_env(env)  # ✅ validates your environment

model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=1_000_000_0)

# generate current datetime
from datetime import datetime
date = datetime.now().strftime('%Y_%m_%d_%H_%M_%S')

model.save(f"ppo_uno_model_{date}")
