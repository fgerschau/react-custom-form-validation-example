import { FC } from 'react';
import { useForm } from './useForm';
import './Registration.scss';

type Gender = 'male' | 'female' | 'non-binary';

interface User {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  password: string;
}

const Registration: FC = () => {
  const { handleSubmit, handleChange, data: user, errors } = useForm<User>({
    validations: {
      name: {
        pattern: {
          value: '/[A-Za-z]*/',
          message:
            "You're not allowed to use special characters or numbers in your name.",
        },
      },
      age: {
        custom: {
          isValid: (value) => parseInt(value, 10) > 17,
          message: 'You have to be at least 18 years old.',
        },
      },
      password: {
        custom: {
          isValid: (value) => value.length > 6,
          message: 'The password needs to be at least 6 characters long.',
        },
      },
    },
    onSubmit: () => alert('User submitted!'),
  });

  return (
    <form className="registration-wrapper" onSubmit={handleSubmit}>
      <h1>Registration</h1>
      <input
        placeholder="Name*"
        value={user.name || ''}
        onChange={handleChange('name')}
        required
      />
      {errors.name && <p className="error">{errors.name}</p>}
      <input
        placeholder="Age"
        type="number"
        value={user.age || ''}
        onChange={handleChange<number>('age', (value) => parseInt(value, 10))}
      />
      {errors.age && <p className="error">{errors.age}</p>}
      <input
        placeholder="Email*"
        type="email"
        value={user.email || ''}
        onChange={handleChange('email')}
      />
      <input
        placeholder="Password*"
        type="password"
        value={user.password || ''}
        onChange={handleChange('password')}
      />
      {errors.password && <p className="error">{errors.password}</p>}
      <select onChange={handleChange('gender')} required>
        <option value="" disabled selected>
          Select gender*
        </option>
        <option value="male" selected={user.gender === 'male'}>
          Male
        </option>
        <option value="female" selected={user.gender === 'female'}>
          Female
        </option>
        <option value="non-binary" selected={user.gender === 'non-binary'}>
          Non-binary
        </option>
      </select>
      <button type="submit" className="submit">
        Submit
      </button>
    </form>
  );
};

export default Registration;
