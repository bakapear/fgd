# fgd
parses FGD files into JSON

Output example:
```json
  {
    "name": "info_target",
    "type": "PointClass",
    "description": "An entity that does nothing. Very useful as a positioning entity for other entities to refer to (i.e. the endpoint of an env_beam)",
    "parameters": [
      {
        "name": "iconsprite",
        "values": [
          "editor/info_target.vmt"
        ]
      }
    ],
    "flags": [
      {
        "title": "Transmit to client",
        "value": 1,
        "enabled": false
      }
    ],
    "properties": [
      {
        "type": "target_source",
        "name": "targetname",
        "title": "Name",
        "description": "The name that other entities refer to this entity by."
      },
      {
        "type": "target_destination",
        "name": "parentname",
        "title": "Parent",
        "description": "The name of this entity's parent in the movement hierarchy. Entities with parents move with their parent."
      },
      {
        "type": "angle",
        "name": "angles",
        "title": "Pitch Yaw Roll (Y Z X)",
        "description": "This entity's orientation in the world. Pitch is rotation around the Y axis, yaw is the rotation around the Z axis, roll is the rotation around the X axis.",
        "deflt": "0 0 0"
      }
    ],
    "outputs": [
      {
        "name": "OnUser1",
        "description": "Fired in response to FireUser1 input.",
        "type": "void"
      },
      {
        "name": "OnUser2",
        "description": "Fired in response to FireUser2 input.",
        "type": "void"
      },
      {
        "name": "OnUser3",
        "description": "Fired in response to FireUser3 input.",
        "type": "void"
      },
      {
        "name": "OnUser4",
        "description": "Fired in response to FireUser4 input.",
        "type": "void"
      }
    ],
    "inputs": [
      {
        "name": "Kill",
        "description": "Removes this entity from the world.",
        "type": "void"
      },
      {
        "name": "KillHierarchy",
        "description": "Removes this entity and all its children from the world.",
        "type": "void"
      },
      {
        "name": "AddOutput",
        "description": "Adds an entity I/O connection to this entity. Format: <output name> <targetname>:<inputname>:<parameter>:<delay>:<max times to fire (-1 == infinite)>. Very dangerous, use with care.",
        "type": "string"
      },
      {
        "name": "FireUser1",
        "description": "Causes this entity's OnUser1 output to be fired.",
        "type": "void"
      },
      {
        "name": "FireUser2",
        "description": "Causes this entity's OnUser2 output to be fired.",
        "type": "void"
      },
      {
        "name": "FireUser3",
        "description": "Causes this entity's OnUser3 output to be fired.",
        "type": "void"
      },
      {
        "name": "FireUser4",
        "description": "Causes this entity's OnUser4 output to be fired.",
        "type": "void"
      },
      {
        "name": "SetParent",
        "description": "Changes the entity's parent in the movement hierarchy.",
        "type": "string"
      },
      {
        "name": "SetParentAttachment",
        "description": "Change this entity to attach to a specific attachment point on its parent. Entities must be parented before being sent this input. The parameter passed in should be the name of the attachment.",
        "type": "string"
      },
      {
        "name": "SetParentAttachmentMaintainOffset",
        "description": "Change this entity to attach to a specific attachment point on it's parent. Entities must be parented before being sent this input. The parameter passed in should be the name of the attachment. The entity will maintain it's position relative to the parent at the time it is attached.",
        "type": "string"
      },
      {
        "name": "ClearParent",
        "description": "Removes this entity from the the movement hierarchy, leaving it free to move independently.",
        "type": "void"
      }
    ]
  }
```