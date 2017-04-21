defmodule PFA.MarkdownEngine do
  @behaviour Slime.Parser.EmbeddedEngine

  def render(text, _options) do
    Earmark.as_html! text
  end
end
