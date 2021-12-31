import threading
import time

def print_time(name, n):
    count = 0
    while count < 5:
        time.sleep(n)
        count+=1
        print("%s: %s" % ( name, time.ctime(time.time()) ))

try:
    hilo1 = threading.Thread(target=print_time, args=("Hilo-1", 2, ) )
    hilo2 = threading.Thread(target=print_time, args=("Hilo-2", 4, ) )

except:
    print("No se pudo ejecutar el hilo")

hilo1.start()
hilo2.start()