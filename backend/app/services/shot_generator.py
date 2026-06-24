def generate_shots(data):

    shots = [

        {
            "shot_type": "Wide Shot",

            "lens": "24mm",

            "camera_movement": "Static",

            "duration": "8 sec",

            "priority": "High"
        },

        {
            "shot_type": "Medium Shot",

            "lens": "50mm",

            "camera_movement": "Pan",

            "duration": "6 sec",

            "priority": "High"
        },

        {
            "shot_type": "Close Up",

            "lens": "85mm",

            "camera_movement": "Dolly In",

            "duration": "5 sec",

            "priority": "High"
        },

        {
            "shot_type": "Over The Shoulder",

            "lens": "50mm",

            "camera_movement": "Shoulder Rig",

            "duration": "6 sec",

            "priority": "Medium"
        },

        {
            "shot_type": "Tracking Shot",

            "lens": "35mm",

            "camera_movement": "Gimbal",

            "duration": "10 sec",

            "priority": "Medium"
        },

        {
            "shot_type": "Drone Shot",

            "lens": "16mm",

            "camera_movement": "Aerial",

            "duration": "12 sec",

            "priority": "Low"
        }

    ]

    return shots