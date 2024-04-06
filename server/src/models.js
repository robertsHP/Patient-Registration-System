// const { Pool } = require('pg');
const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config({ path: '../.env' });

// const pool = new Pool({
//     user:       process.env.POSTGRES_USER,
//     password:   process.env.POSTGRES_PASSWORD,
//     host:       process.env.POSTGRES_HOST,
//     port:       process.env.POSTGRES_PORT,
//     database:   process.env.POSTGRES_DB
// });

const sequelize = new Sequelize(
    process.env.POSTGRES_DB, 
    process.env.POSTGRES_USER, 
    process.env.POSTGRES_PASSWORD, 
    {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres'
    }
);

// Room Model
const Room = sequelize.define('Room', {
  id_room: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  room_num: {
    type: DataTypes.STRING(10)
  }
});

// PatientType Model
const PatientType = sequelize.define('PatientType', {
  id_pat_type: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  pat_type: {
    type: DataTypes.STRING(7)
  }
});

// Doctor Model
const Doctor = sequelize.define('Doctor', {
  id_doctor: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  doc_name: {
    type: DataTypes.STRING(70)
  }
});

// Patient Model
const Patient = sequelize.define('Patient', {
  id_patient: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  pat_name: {
    type: DataTypes.STRING(20)
  },
  phone_num: {
    type: DataTypes.STRING(45)
  },
  hotel_stay_start: {
    type: DataTypes.DATE
  },
  hotel_stay_end: {
    type: DataTypes.DATE
  },
  id_pat_type: {
    type: DataTypes.INTEGER,
    references: {
      model: PatientType,
      key: 'id_pat_type'
    }
  }
});

// Sauna Model
const Sauna = sequelize.define('Sauna', {
  id_sauna: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  notes: {
    type: DataTypes.TEXT
  },
  id_doctor: {
    type: DataTypes.INTEGER,
    references: {
      model: Doctor,
      key: 'id_doctor'
    }
  }
});

// Beds Model
const Beds = sequelize.define('Beds', {
  id_beds: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_room: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'id_room'
    }
  },
  id_patient: {
    type: DataTypes.INTEGER,
    references: {
      model: Patient,
      key: 'id_patient'
    }
  },
  begin_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
});

// Bed Model
const Bed = sequelize.define('Bed', {
  id_bed: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_room: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'id_room'
    }
  }
});

// Beds4 Model
const Beds4 = sequelize.define('Beds4', {
  id_beds4: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_room: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'id_room'
    }
  },
  id_patient: {
    type: DataTypes.INTEGER,
    references: {
      model: Patient,
      key: 'id_patient'
    }
  },
  begin_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = { Room, PatientType, Doctor, Patient, Sauna, Beds, Bed, Beds4 };