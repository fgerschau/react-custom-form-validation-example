import { ChangeEvent } from 'react';
import { useForm } from './useForm';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

interface TestData {
  name: string;
  bool: boolean;
  num: number;
}

describe('useForm', () => {
  const getFakeTestEvent = (value: any = '') =>
    (({
      preventDefault: jest.fn(),
      target: { value },
    } as unknown) as ChangeEvent<any>);

  describe('smoke test', () => {
    it('should be a function', () => {
      expect(typeof useForm).toBe('function');
    });
  });

  describe('updating', () => {
    it('should update the data', () => {
      const { result } = renderHook(() => useForm<TestData>());
      expect(result.current.data.name).toBeUndefined();
      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('test'));
      });

      expect(result.current.data.name).toBe('test');
    });

    it('should initialize the data', () => {
      const { result } = renderHook(() =>
        useForm<TestData>({
          initialValues: {
            name: 'John',
          },
        })
      );

      expect(result.current.data.name).toBe('John');
      expect(result.current.data.bool).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should call the onSubmit callback when there are no errors', () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          onSubmit,
        })
      );
      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should validate required values', () => {
      const requiredMessage = 'This field is required';
      const onSubmit = jest.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            name: {
              required: {
                value: true,
                message: requiredMessage,
              },
            },
          },
          onSubmit,
        })
      );

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.name).toBe(requiredMessage);
    });

    it('should validate patterns', () => {
      const validationMessage = "This field isn't formatted correctly.";
      const onSubmit = jest.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            name: {
              pattern: {
                value: '/[A-Za-z]*/',
                message: validationMessage,
              },
            },
          },
          onSubmit,
        })
      );

      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('Felix123'));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.name).toBe(validationMessage);
    });

    it('should validate custom validations', () => {
      const validationMessage = 'The minimum length is 7 characters.';
      const onSubmit = jest.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            name: {
              custom: {
                isValid: (value) => value?.length > 6,
                message: validationMessage,
              },
            },
          },
          onSubmit,
        })
      );

      // Name is long enough
      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('Felix123'));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(result.current.errors.name).toBeUndefined();

      // Name is too short
      onSubmit.mockReset();
      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('123'));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.name).toBe(validationMessage);
    });

    it('should validate multiple validations', () => {
      const validationMessage = "This field isn't formatted correctly.";
      const onSubmit = jest.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            name: {
              pattern: {
                value: '/[A-Za-z]*/',
                message: validationMessage,
              },
              custom: {
                isValid: (value) => value?.length > 6,
                message: validationMessage,
              },
            },
          },
          onSubmit,
        })
      );

      // Name is too short and contains numbers
      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('123'));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    it('should reset errors on submit', () => {
      const validationMessage = 'The minimum length is 7 characters.';
      const onSubmit = jest.fn();
      const { result } = renderHook(() =>
        useForm<TestData>({
          validations: {
            name: {
              custom: {
                isValid: (value) => value?.length > 6,
                message: validationMessage,
              },
            },
          },
          onSubmit,
        })
      );

      // Name is too short
      onSubmit.mockReset();
      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('123'));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(result.current.errors.name).toBe(validationMessage);

      // Name is long enough
      act(() => {
        result.current.handleChange('name')(getFakeTestEvent('Felix123'));
      });

      act(() => {
        result.current.handleSubmit(getFakeTestEvent());
      });

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(result.current.errors.name).toBeUndefined();
    });
  });
});
