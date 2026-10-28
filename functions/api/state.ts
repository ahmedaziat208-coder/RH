interface D1Result {
  meta: { changes: number };
}

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface Env {
  RH_DB: D1Database;
}

type PagesFunctionContext<EnvType> = {
  request: Request;
  env: EnvType;
};

type PagesFunction<EnvType> = (context: PagesFunctionContext<EnvType>) => Promise<Response>;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const result = await env.RH_DB
      .prepare(
        "SELECT id, revision, state_json FROM rh_app_state WHERE id = 1"
      )
      .first<{
        id: number;
        revision: number;
        state_json: string;
      }>();

    if (!result) {
      return Response.json(
        { error: "لم يتم العثور على بيانات النظام السحابية" },
        { status: 404 }
      );
    }

    return Response.json({
      revision: result.revision,
      state: JSON.parse(result.state_json),
    });
  } catch {
    return Response.json(
      { error: "تعذر قراءة بيانات النظام" },
      { status: 500 }
    );
  }
};

export const onRequestPost: PagesFunction<Env> = async ({
  request,
  env,
}) => {
  try {
    const body = (await request.json()) as {
      state?: unknown;
      revision?: number;
    };

    if (
      !body ||
      typeof body.state !== "object" ||
      body.state === null ||
      Array.isArray(body.state)
    ) {
      return Response.json(
        { error: "صيغة البيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const stateJson = JSON.stringify(body.state);

    if (stateJson.length > 1_000_000) {
      return Response.json(
        { error: "حجم البيانات أكبر من المسموح" },
        { status: 413 }
      );
    }

    const current = await env.RH_DB
      .prepare(
        "SELECT revision FROM rh_app_state WHERE id = 1"
      )
      .first<{ revision: number }>();

    if (!current) {
      return Response.json(
        { error: "لا توجد نسخة سحابية محفوظة لتحديثها" },
        { status: 404 }
      );
    }

    if (
      typeof body.revision !== "number" ||
      body.revision !== current.revision
    ) {
      return Response.json(
        {
          error: "تغيرت النسخة السحابية؛ أعد تحميل البيانات قبل الحفظ",
          revision: current.revision,
        },
        { status: 409 }
      );
    }

    const nextRevision = current.revision + 1;

    const result = await env.RH_DB
      .prepare(
        `UPDATE rh_app_state
         SET state_json = ?, revision = ?
         WHERE id = 1 AND revision = ?`
      )
      .bind(stateJson, nextRevision, current.revision)
      .run();

    if (!result.meta.changes) {
      return Response.json(
        { error: "تغيرت البيانات أثناء الحفظ؛ أعد تحميلها" },
        { status: 409 }
      );
    }

    return Response.json({ success: true, revision: nextRevision });
  } catch {
    return Response.json(
      { error: "تعذر حفظ البيانات السحابية" },
      { status: 500 }
    );
  }
};
