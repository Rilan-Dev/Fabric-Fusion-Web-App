import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAddresses, useCreateOrder } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutStepper from '@/components/common/CheckoutStepper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: cartData } = useCart();
  const { data: addressesData } = useAddresses();
  const createOrder = useCreateOrder();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');

  const cart = cartData?.data;
  const addresses = addressesData?.data || [];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-muted-foreground mb-6">You need to login to proceed with checkout</p>
          <Button onClick={() => navigate('/auth')}>Login</Button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    createOrder.mutate(
      {
        shippingAddressId: selectedAddressId,
        paymentMethod,
      },
      {
        onSuccess: () => {
          navigate('/account');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <CheckoutStepper currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start space-x-3 p-4 border rounded-lg"
                        >
                          <RadioGroupItem value={address.id} id={address.id} />
                          <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                            <div className="font-semibold">{address.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {address.addressLine1}, {address.addressLine2}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {address.cityName}, {address.stateName} - {address.pincode}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {address.phoneNumber}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedAddressId}
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">
                            Pay when you receive
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          <div className="font-semibold">UPI</div>
                          <div className="text-sm text-muted-foreground">
                            PhonePe, Google Pay, Paytm
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Credit/Debit Card</div>
                          <div className="text-sm text-muted-foreground">
                            Visa, Mastercard, RuPay
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={() => setCurrentStep(3)}>
                      Continue to Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      {addresses.find((a) => a.id === selectedAddressId) && (
                        <div className="text-sm text-muted-foreground">
                          {addresses.find((a) => a.id === selectedAddressId)?.addressLine1}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="text-sm text-muted-foreground capitalize">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handlePlaceOrder}
                      disabled={createOrder.isPending}
                    >
                      {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cart?.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{cart?.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{cart?.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₹{cart?.total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
