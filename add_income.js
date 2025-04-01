document.getElementById("incomeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const source = document.getElementById("incomeSource").value;
    const amount = document.getElementById("incomeAmount").value;
    const date = document.getElementById("incomeDate").value;

    const response = await fetch("/add_income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, amount, date })
    });

    if (response.ok) {
        alert("Income added successfully!");
        window.location.href = "user_dashboard.html";
    } else {
        alert("Failed to add income. Try again.");
    }
});
