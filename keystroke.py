from pynput import keyboard
import time
import wave
import winsound
import pygame.mixer

# 音再生処理


def Sound():
    pygame.mixer.init()  # 初期化
    pygame.mixer.music.load('beep.mp3')  # 読み込み
    pygame.mixer.music.play(-1)  # ループ再生（引数を1にすると1回のみ再生）


def callb(key):  # what to do on key-release
    # converting float to str, slicing the float

    ti1 = str(time.time() - t)[0:5]
    print("The key", key, " is pressed for", ti1, 'seconds')
    pygame.mixer.music.stop()  # 終了


def callb1(key):  # what to do on key-press
    Sound()


# setting code for listening key-press
with keyboard.Listener(on_press=callb1) as listener1:

    listener1.join()


t = time.time()  # reading time in sec

# setting code for listening key-release
with keyboard.Listener(on_release=callb) as listener:
    listener.join()
    winsound.SND_PURGE
