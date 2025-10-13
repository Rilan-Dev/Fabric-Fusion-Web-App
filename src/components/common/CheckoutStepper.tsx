import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Address' },
  { number: 2, title: 'Payment' },
  { number: 3, title: 'Review' },
];

const CheckoutStepper = ({ currentStep }: CheckoutStepperProps) => {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep > step.number
                  ? 'bg-primary border-primary text-primary-foreground'
                  : currentStep === step.number
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground text-muted-foreground'
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="font-semibold">{step.number}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 transition-all ${
                currentStep > step.number ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutStepper;
