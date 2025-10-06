import numpy as np
import matplotlib.pyplot as plt

# Create a grid of points for vector field
x = np.linspace(-1.5, 1.5, 12)
y = np.linspace(-1.5, 1.5, 12)
X, Y = np.meshgrid(x, y)

# Define parameters for logarithmic spiral
# r = a * e^(b*theta)
a = 0.1  # scaling factor
b = 0.15  # spiral tightness (positive = outward, negative = inward)

# Create spiral curves
theta_spiral = np.linspace(-4 * np.pi, 4 * np.pi, 1000)
r_spiral = a * np.exp(b * theta_spiral)

# Convert to Cartesian coordinates for spiral curves
x_spiral = r_spiral * np.cos(theta_spiral)
y_spiral = r_spiral * np.sin(theta_spiral)

# Filter spirals to stay within plot bounds
mask = (np.abs(x_spiral) <= 1.5) & (np.abs(y_spiral) <= 1.5)
x_spiral = x_spiral[mask]
y_spiral = y_spiral[mask]

# Create multiple spiral curves with vectors on them
plt.figure(figsize=(10, 10))

# Plot a single spiral curve with vectors
start_angle = 0  # starting angle for the single curve
theta_curve = np.linspace(-5 * np.pi, 5 * np.pi, 800) + start_angle
r_curve = a * np.exp(b * theta_curve)
x_curve = r_curve * np.cos(theta_curve)
y_curve = r_curve * np.sin(theta_curve)

# Filter to plot bounds
mask_curve = (np.abs(x_curve) <= 1.5) & (np.abs(y_curve) <= 1.5)
x_curve = x_curve[mask_curve]
y_curve = y_curve[mask_curve]
theta_filtered = theta_curve[mask_curve]

if len(x_curve) > 0:
    # Plot the spiral curve
    plt.plot(x_curve, y_curve, "k-", linewidth=1.5, alpha=0.7)

    # Calculate cumulative arc length along the curve
    dx = np.diff(x_curve)
    dy = np.diff(y_curve)
    arc_lengths = np.sqrt(dx**2 + dy**2)
    cumulative_length = np.concatenate([[0], np.cumsum(arc_lengths)])

    # Place vectors at even arc-length intervals
    total_length = cumulative_length[-1]
    target_spacing = total_length / 15  # about 15 vectors per curve

    current_length = 0
    while current_length < total_length:
        # Find the index closest to current target length
        idx = np.argmin(np.abs(cumulative_length - current_length))

        if idx < len(x_curve):
            x_pos = x_curve[idx]
            y_pos = y_curve[idx]
            theta_pos = theta_filtered[idx]

            # Calculate tangent vector at this point
            dxdt = b * x_pos - y_pos
            dydt = b * y_pos + x_pos

            # Speed is the magnitude of the velocity vector
            speed = np.sqrt(dxdt**2 + dydt**2)

            # Scale vector length proportional to speed
            scale_factor = 0.45  # adjust this to make vectors visible (0.15 * 3)
            u_scaled = dxdt * scale_factor
            v_scaled = dydt * scale_factor

            # Plot the vector
            plt.arrow(
                x_pos,
                y_pos,
                u_scaled,
                v_scaled,
                head_width=0.04,
                head_length=0.06,
                fc="black",
                ec="black",
                alpha=0.9,
            )

        current_length += target_spacing

# Add grid lines
plt.grid(True, alpha=0.3)

# Set axis properties
plt.xlim(-1.5, 1.5)
plt.ylim(-1.5, 1.5)
plt.xlabel("x", fontsize=14)
plt.ylabel("y", fontsize=14)

# Make axes equal and add ticks
plt.axis("equal")
plt.xticks(np.arange(-1.5, 2, 0.5))
plt.yticks(np.arange(-1.5, 2, 0.5))

# Add title
plt.title("Spiral Vector Field", fontsize=16)

# Show the plot
plt.tight_layout()
plt.show()

# Optionally save the plot
# plt.savefig('spiral_vector_field.png', dpi=300, bbox_inches='tight')
