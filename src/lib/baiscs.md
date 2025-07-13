# Your first LayerChart
  
Creating charts is a complex endeavor considering the different types of charts, various data formats, and the need for customization. It can be hard to balance the need for flexibility with the desire for simplicity. This brings us the the first decision you will make starting your first LayerChart.

## Use `<Chart>` or a Simple Chart.

1. If you use `<Chart>`, you will layer in the exact subcomponents you wish to make your chart.
   - The props details are fully up to you and fully customizable but the tradeoff is that you will need to implement more of the chart yourself.
   - This is a good choice if you are experienced with Layerchart or plan on a need extensive control of many of the chart components.

 2. You can use a Simple Chart if you are making a chart of supported types [ArcChart](https://next.layerchart.com/docs/components/ArcChart), [AreaChart](https://next.layerchart.com/docs/components/AreaChart), [BarChart](https://next.layerchart.com/docs/components/BarChart), [PieChart](https://next.layerchart.com/docs/components/PieChart) or [ScatterChart](https://next.layerchart.com/docs/components/ScatterChart) (more supported simple charts to come)
      - This is the recommended path for most users.
      - Under the hood, a simple chart is just a `<Chart>` with a set of default subcomponents and props. 
      - Simple charts provide a lot of the common functionality you need out of the box with exposed props which should cover most of the simple customizations.
     - Lets use <[LineChart](https://next.layerchart.com/docs/components/LineChart)> as and example and look at how little code is need to make this complex chart including default built in tooltips, rule, axes, highlights and added legend.

```html
<div class="h-[300px] p-4 border rounded-sm">
  <LineChart
    data={multiSeriesData}
    x="date"
    series={[
      { key: "apples", label: "Apples", color: "var(--color-danger)" },
      { key: "bananas", label: "Bananas", color: "var(--color-success)" },
      { key: "oranges", label: "Oranges", color: "var(--color-warning)" },
    ]}
    legend
  />
</div>
```

## Additional Simple Charts Customization

What happens when you inevidently wish to tweak something in your simplechart and that customization is not accessible via props? While you could rewrite with `<Chart>`, simplecharts fortunately gives you an escape hatch. Simple charts accepts children snippets giving you full control over the subcomponents just like a layered `<Chart>`.

Here is a bit of a contrived example where we will uppercase the legend labels. We will use use a legend snippet to achieve this.

```html
<LineChart legend ... />
```

becomes

```html
<LineChart ...>
  {#snippet legend({ getLegendProps })}
    <Legend {...getLegendProps()} tickFormat={(s) => s.toUpperCase()} />
  {/snippet}
</LineChart>
</pre>

Notice how we send getLegendProps to the snippet and then pass it to the `<Legend>` component. This is a common powerful pattern in Layerchart simple charts where you can use snippets to customize the rendering of components while still leveraging all of the the underlying simple chart's functionality. 

  - It is a best practice to place the {...getLegendProps()} as the first prop. This allows you to overwrite any of it's props by listing them to follow.

The legend snippet by default visually applies the `<Legend>` subcomponent above the chart elements. However with certain other components you may wish them to appear in different "layers". If you were using the `<Chart>` approach, you would just change the order you implement subcomponents. However because these are snippets, the simple chart is rendering them in a certain logical order. This may not be exactly what you want, so simple chart gives you some additional snippets to allow you to control where they are rendered in relation to the chart elements.

- {#snippet marks()} applies them with other chart elements
- {#snippet abovemarks()} applies them above chart elements
- {#snippet belowmarks()} applies them below chart elements

