defmodule PFA.Page do
  use PFA.Web, :model

  schema "pages" do
    field :url, :string
    field :content, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:url, :content])
    |> validate_required([:url, :content])
  end
end
