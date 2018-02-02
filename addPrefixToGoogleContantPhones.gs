function UpdateContacts(){
  
  // --- AUXILIARY FUNCTIONS:
  function HasPrexis(phone) {
    const firstChar = phone[0];
    const first2Chars = phone.slice(0,2);
    if (firstChar === '+' || first2Chars === '00') {
      return true;
    } else {
      return false;
    }
  }
  
  function RemoveSpaces(phone) {
    return phone.replace(/\s/g,'');
  }
  
  function IsSpanish(phone) {
    const phoneNoSpaces = RemoveSpaces(phone);
    if (phoneNoSpaces.slice(0,3) === '+34' ||
      phoneNoSpaces.slice(0,4) === '0034') {
      return true;
    } else {
      switch (phoneNoSpaces[0]) {
        case '6': { return true; }
        case '9': { return true; }
        default: { return false; }
      }
    }
  }
  
  function IsUnitedKingdom(phone) {
    const phoneNoSpaces = RemoveSpaces(phone);
    if (phoneNoSpaces.slice(0,3) === '+44' ||
      phoneNoSpaces.slice(0,4) === '0044') {
      return true;
    } else {
      switch (phoneNoSpaces.slice(0,2)) {
        case '01': { return true; }
        case '02': { return true; }
        case '03': { return true; }
        case '07': { return true; }
        case '08': { return true; }
        default: { return false; }
      }
    }
  }
  
  function Spanish(phone) {
    const phoneNoSpaces = RemoveSpaces(phone);
    return '+34 '
      + phoneNoSpaces.slice(0,3) + ' '
      + phoneNoSpaces.slice(3,6) + ' '
      + phoneNoSpaces.slice(6,9)
  }
  
  function UnitedKingdom(phone) {
    const phoneNoSpaces = RemoveSpaces(phone);
    return '+44 '
      + phoneNoSpaces.slice(1,5) + ' '
      + phoneNoSpaces.slice(5,8) + ' '
      + phoneNoSpaces.slice(8,11);
  }
  
  function FormatPhone(phone) {
    if (HasPrexis(phone)) {
      return phone;
    } else {
      switch (true) {
        case IsSpanish(phone): {
          return Spanish(phone);
        }
        case IsUnitedKingdom(phone): {
          return UnitedKingdom(phone);
        }
        default: {
          return phone;
        }
      }
    }
  }
  
  // --- MAIN FUNCTION:
  Logger.clear();
  
  const update = true;
  ContactsApp.getContactGroup('TO BATCH').getContacts().map(function (contact) {
    const name = contact.getFullName();
    msg = name;
    try {
      if (name) {
        const phones = contact.getPhones().forEach(function(phone){
          const oldNum = {
            number: phone.getPhoneNumber(),
            label: phone.getLabel(),
            isPrimary: phone.isPrimary()
          }
          
          msg += '\n\t' + oldNum.number;
          msg +=    ' ' + oldNum.label;
          msg +=    ' ' + oldNum.isPrimary;
          
          const newNum = FormatPhone(oldNum.number);
          msg += '   >   ' + newNum;
          
          if (update) {
            msg += '\n\tupdating contact...';
            // add new phone
            const newPhone = contact.addPhone(oldNum.label, newNum);
            oldNum.isPrimary ? newPhone.setAsPrimary() : null;
            
            // remove old phone
            phone.deletePhoneField();
          }
          
        });
      }
      msg += '\n\n';
      Logger.log(msg);
    }
    catch(error) {
      msg += '\nERROR';
      msg += '\n\n';
      Logger.log(msg);
    }
  });
}