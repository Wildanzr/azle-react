import React, { useState } from "react";

function App() {
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitted(false);
    setLoading(true);
    const domain = e.target.elements.domain.value;
    const payload = { domain };

    const response = await fetch(
      `${import.meta.env.VITE_CANISTER_URL}/check-domain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    setSubmitted(true);
    setLoading(false);
    const result = await response.json();
    setIsValid(result.valid);
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ffffff",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <img
          src="/logo2.svg"
          alt="DFINITY logo"
          style={{ display: "block", margin: "0 auto 20px", width: "100px" }}
        />
        <form
          action="#"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <label
            htmlFor="domain"
            style={{
              fontSize: "16px",
              fontWeight: "500",
              textAlign: "center",
              width: "100%",
            }}
          >
            Check Email Domain is Valid or Not
          </label>
          <input
            id="domain"
            alt="Domain"
            type="text"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "16px",
              width: "100%",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#ffffff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Check Now
          </button>
        </form>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <section
            style={{
              textAlign: "center",
              borderRadius: "5px",
              color: "#ffffff",
              backgroundColor: isValid ? "green" : "red",
            }}
          >
            {submitted && (
              <div>
                {isValid ? (
                  <p>Email domain is valid</p>
                ) : (
                  <p>Email domain is invalid</p>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
