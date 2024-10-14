#include "secrets.h"
#include <Firebase.h>

/* Use the following instance for Test Mode (No Authentication) */
Firebase fb(REFERENCE_URL);

/* Use the following instance for Locked Mode (With Authentication) */
// Firebase fb(REFERENCE_URL, AUTH_TOKEN);

const char* LED_STATE_PATH = "led_state";

void setup() {
  Serial.begin(115200);
  #if !defined(ARDUINO_UNOWIFIR4)
    WiFi.mode(WIFI_STA);
  #endif
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);
  WiFi.disconnect();
  delay(1000);

  /* Connect to WiFi */
  Serial.println();
  Serial.println();
  Serial.print("Connecting to: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("-");
    delay(500);
  }

  Serial.println();
  Serial.println("WiFi Connected");
  Serial.println();

  // Initialize LED state in Firebase
  fb.setBool(LED_STATE_PATH, false);
}

void loop() {
  // Read LED state from Firebase
  bool led_state = fb.getBool(LED_STATE_PATH);
  
  // Update LED based on Firebase state
  digitalWrite(LED_BUILTIN, led_state ? HIGH : LOW);
  
  // Print current state
  Serial.print("LED State: ");
  Serial.println(led_state ? "ON" : "OFF");
  
  // Wait for a moment before checking again
  delay(1000);
}