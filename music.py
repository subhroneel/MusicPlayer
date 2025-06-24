import pygame
import os

# Initialize pygame mixer
pygame.mixer.init()

# Set up the music file
music_file = "./AinvayiAinvayi.mp3"

if not os.path.exists(music_file):
    print("Music file not found. Please upload an MP3 file named 'AinvayiAinvayi.mp3'.")
    exit()

# Load the music
pygame.mixer.music.load(music_file)

print("🎵 Simple Music Player 🎵")
print("Commands: play | pause | resume | stop | quit")

paused = False

while True:
    command = input("Enter command: ").strip().lower()
    
    if command == "play":
        pygame.mixer.music.play()
        paused = False
        print("Playing...")
        
    elif command == "pause":
        if not paused:
            pygame.mixer.music.pause()
            paused = True
            print("Paused.")
        else:
            print("Already paused.")
            
    elif command == "resume":
        if paused:
            pygame.mixer.music.unpause()
            paused = False
            print("Resumed.")
        else:
            print("Not paused.")
            
    elif command == "stop":
        pygame.mixer.music.stop()
        print("Stopped.")
        
    elif command == "quit":
        pygame.mixer.music.stop()
        print("Exiting...")
        break
        
    else:
        print("Unknown command.")
