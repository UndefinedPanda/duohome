# DuoHome

### Notes

    - Parents can create a family
    - Co-Parents and Step Parents can be added to families via QR code  ** user invite for now ** 
    - All Events will be saved under the family
    - Step Parents can be added to message both parents, view information, or given additional permissions
    - Only the parent who created the event, can delete the event
    - Parents who did not create the event are able to request event changes (information, appointment change, unavailable, etc)

    - Events will have predetermined types
    - Event Types will have predefined colours, which the user can customize

    - Save User Preferences in the database and load on sign in
        - Calendar Dot Colors, Themes, etc.

### Family Schema

    - id
    - name
    - premium_family

### FamilyParent Schema

    - id
    - family_id
    - parent_id

### Parents Schema

    - id
    - email
    - first_name
    - last_name
    - parent_type (father, mother, step parent)
    - premium_user
