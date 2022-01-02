import json
from random import random, randrange
from sys import getsizeof
from locust import HttpUser, task, between
#librerias que usa el sistema
debug = True


def printDebug(msg): # metodo para mostrar mensajes el debug
    
    if debug:
        print(msg)


def loadData(): #metodo para cargar la informacion
    try:
    
        with open("traffic.json", 'r') as data_file: #buscamos y recorremos el archivo
            
            array = json.loads(data_file.read())
            return array
        
        print (f'>> Reader: Datos cargados correctamente, {len(array)} datos -> {getsizeof(array)} bytes.')
    except Exception as e: # si ocurre una excepcion
        
        print (f'>> Reader: No se cargaron los datos {e}')
        return []

array = loadData()


class Reader(): #clase para leer el archivo

    
    def pickRandom(self): #para poder acceder de manera aleatoria a los datos
        
        length = len(array)
        
        if (length > 0):
            
            random_index = randrange(0, length - 1) if length > 1 else 0

            
            return array.pop(random_index) #luego de tomar el valor del array, lo libera para ya no ser tomado en cuenta

        
        else:
            
            print (">> Reader: No hay más valores para leer en el archivo.")
            
            return None #finalzia la lectura del archivo

class MessageTraffic(HttpUser):
    
    wait_time = between(0.1, 0.9) #intervalo entre cada peticion


    def on_start(self):
        print (">> MessageTraffic: Iniciando el envio de tráfico") #mensaje para definir el inicio del trafico
        
        self.reader = Reader()
        

    
    @task
    def PostMessage(self):
        
        random_data = self.reader.pickRandom() #tomamos el valor random
        
        
        if (random_data is not None):
            
            data_to_send = json.dumps(random_data) #leemos el archivo
            
            printDebug (data_to_send)

            
            self.client.post("/entrada", json=random_data) #endpoint que se va a consumir

        
        else:
            print(">> MessageTraffic: Envio de tráfico finalizado, no hay más datos que enviar.")
            
            self.stop(True)

    
