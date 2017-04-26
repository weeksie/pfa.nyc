defmodule PFA.MarkdownHelper do
  def md(text) do
    text
    |> Earmark.as_html!
    |> Phoenix.HTML.raw
  end
end
