import { ChangeEvent, FC, FormEvent, useState } from 'react';
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
  const [user, setUser] = useState<User>({} as User);
  const handleChange = (key: keyof User) => (
    e: ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) => {
    let value: string | number = e.target.value;
    if (e.target.type === 'number') {
      value = parseInt(value, 10);
    }

    setUser({
      ...user,
      [key]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('User submitted successfully!');
  };

  return (
    <form className="registration-wrapper" onSubmit={handleSubmit}>
      <h1>Registration</h1>
      <input
        placeholder="Name*"
        value={user.name}
        onChange={handleChange('name')}
        required
      />
      <input
        placeholder="Age"
        type="number"
        value={user.age}
        onChange={handleChange('age')}
      />
      <input
        placeholder="Email*"
        type="email"
        value={user.email}
        onChange={handleChange('email')}
      />
      <input
        placeholder="Password*"
        type="password"
        value={user.password}
        onChange={handleChange('password')}
      />
      <select onChange={handleChange('gender')} required>
        <option value="" disabled selected>
          Select gender*
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="non-binary">Non-binary</option>
      </select>
      <button type="submit" className="submit">
        Submit
      </button>
    </form>
  );
};

export default Registration;
