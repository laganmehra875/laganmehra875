import struct
import wave
import math
import random

def generate_rocket_sound(filename="rocket.wav", duration=4.0, sample_rate=44100):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        
        # State for a simple lowpass filter
        last_val = 0
        
        for i in range(int(sample_rate * duration)):
            t = i / sample_rate
            
            # Envelope (fade in over 0.5s, sustain, fade out over 1s)
            if t < 0.5:
                env = t / 0.5
            elif t < 3.0:
                env = 1.0
            else:
                env = max(0, 1.0 - (t - 3.0))
                
            # White noise
            noise = random.uniform(-1, 1)
            
            # Simple lowpass filter (exponential moving average) to make the noise rumbly
            # Lowering the alpha makes the cutoff frequency lower
            # Let's dynamically change the alpha to simulate engine ramping up
            # Alpha goes from 0.05 to 0.2
            alpha = 0.05 + 0.15 * min(t, 1.0)
            val = alpha * noise + (1 - alpha) * last_val
            last_val = val
            
            # Add some low frequency rumble explicitly
            rumble1 = math.sin(2 * math.pi * 40 * t) * 0.3 * env
            rumble2 = math.sin(2 * math.pi * 80 * t) * 0.2 * env
            
            # Combine and normalize
            final_val = (val * 1.5 + rumble1 + rumble2) * env * 0.8
            
            # Clip
            final_val = max(-1.0, min(1.0, final_val))
            
            sample = int(final_val * 32767)
            wav_file.writeframes(struct.pack('<h', sample))

if __name__ == "__main__":
    generate_rocket_sound()
