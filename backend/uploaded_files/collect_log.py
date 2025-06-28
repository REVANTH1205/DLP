import os
import zipfile
import win32evtlog
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def collect_event_logs(logtype, save_path):
    server = 'localhost'
    hand = win32evtlog.OpenEventLog(server, logtype)
    flags = win32evtlog.EVENTLOG_BACKWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ
    logs = []
    
    while True:
        events = win32evtlog.ReadEventLog(hand, flags, 0)
        if not events:
            break
        for event in events:
            if event.StringInserts:
                logs.append("\n".join(event.StringInserts))

    win32evtlog.CloseEventLog(hand)
    
    log_file_path = os.path.join(save_path, f"{logtype}_logs.txt")
    with open(log_file_path, "w", encoding="utf-8") as file:
        file.write("\n".join(logs))
    print(f"{logtype} logs saved at: {log_file_path}")

def export_event_log_files(logtype, save_path):
    evtx_file = os.path.join(save_path, f"{logtype}.evtx")
    os.system(f'wevtutil epl "{logtype}" "{evtx_file}"')
    print(f"{logtype} event log file saved at: {evtx_file}")

def compress_logs(save_path, output_zip):
    zip_file_path = os.path.join(save_path, output_zip)
    
    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(save_path):
            for file in files:
                file_path = os.path.join(root, file)
                # Ensure we're not adding the zip file itself
                if file_path != zip_file_path:
                    zipf.write(file_path, os.path.relpath(file_path, save_path))
    
    print(f"Logs compressed into: {zip_file_path}")
    return zip_file_path

def encrypt_file(input_file, output_file, password):
    key = password.ljust(32)[:32].encode()
    iv = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    with open(input_file, "rb") as f:
        data = f.read()
    
    # Apply PKCS7 padding
    padding_length = 16 - (len(data) % 16)
    data += bytes([padding_length] * padding_length)
    
    encrypted_data = cipher.encrypt(data)
    
    with open(output_file, "wb") as f:
        f.write(iv + encrypted_data)
    
    print(f"Encrypted file saved as: {output_file}")

def main():
    save_directory = r"G:\\sem 2\\mini  project\\Log_collection\\collectedLogs"
    
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)
    
    print("Collecting Windows Event Logs...")
    for log_type in ["System", "Security", "Application"]:
        collect_event_logs(log_type, save_directory)
        export_event_log_files(log_type, save_directory)
    
    print("Compressing logs...")
    zip_file = compress_logs(save_directory, "logs.zip")
    
    print("Encrypting logs...")
    encrypted_file = os.path.join(save_directory, "logs_encrypted.aes")
    encrypt_file(zip_file, encrypted_file, "your_secure_password")
    
    print("Process completed successfully!")

if __name__ == "__main__":
    main()
