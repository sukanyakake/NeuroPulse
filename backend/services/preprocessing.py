import numpy as np

class PreprocessingService:
    @staticmethod
    def format_for_lstm(data_list):
        """
        Converts the 7-day list into a 3D tensor for the neural network.
        Shape: (Batch=1, Timesteps=7, Features=4)
        """
        arr = np.array(data_list)
        return arr.reshape(1, 7, 4)