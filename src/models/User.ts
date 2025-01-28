import { Schema, models, model } from 'mongoose';

const selectedNumberSchema = new Schema({
  number: {
    type: Number,
    required: true
  },
  selected_at: {
    type: Date,
    required: true
  }
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  selected_numbers: [selectedNumberSchema],
  qtdNumbers: {
    type: Number,
    default: 250
  },
  theme: {
    type: String,
    default: 'default'
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export const User = models.User || model('User', userSchema); 