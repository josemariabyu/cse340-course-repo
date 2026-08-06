import bcrypt from 'bcryptjs';

const hash = '$2b$10$R2JMeFUL6DBBGvKHTIP05uYCnk8GKYmYqdXDljSinJ6v/9ZofyEoG';
console.log('¿Es válido "cse340!"?', bcrypt.compareSync('cse340!', hash));

